import { createClient } from 'jsr:@supabase/supabase-js@2';
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  fileUrl: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const { fileUrl } = await req.json() as RequestBody;

    // Download the CSV from Supabase Storage
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('csv-exports')
      .download(fileUrl.split('/').pop()!);

    if (downloadError) {
      throw new Error(`Error downloading file: ${downloadError.message}`);
    }

    const csvContent = await fileData.text();

    // Process with OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a CSV data processor. Analyze the following CSV data and enhance it. 
                   Return ONLY the processed CSV content in the same format, with potential improvements 
                   such as data cleaning, standardization, or enrichment.`
        },
        {
          role: 'user',
          content: csvContent
        }
      ],
      temperature: 0.3,
    });

    const processedCsv = completion.choices[0].message.content;

    // Generate a unique filename for the processed CSV
    const timestamp = new Date().getTime();
    const processedFilename = `processed-${timestamp}.csv`;

    // Upload the processed CSV back to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('csv-exports')
      .upload(processedFilename, processedCsv, {
        contentType: 'text/csv',
        cacheControl: '3600',
      });

    if (uploadError) {
      throw new Error(`Error uploading processed file: ${uploadError.message}`);
    }

    // Get the public URL of the processed file
    const { data: urlData } = supabaseClient
      .storage
      .from('csv-exports')
      .getPublicUrl(processedFilename);

    return new Response(
      JSON.stringify({
        success: true,
        url: urlData.publicUrl,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});