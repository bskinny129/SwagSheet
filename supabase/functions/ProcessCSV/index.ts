import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  csvData: Blob;
}

const MB = 1024 * 1024

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

    const { csvData } = await req.json() as RequestBody;
    const randomFourDigit = Math.floor(1000 + Math.random() * 9000);

    const rawFilename = `raw-${randomFourDigit}-${Date.now()}.csv`;

    // Upload the processed CSV back to Supabase Storage
    const { data: rawUploadData, error: rawUploadError } = supabaseClient
      .storage
      .from('csv-exports')
      .upload(rawFilename, csvData, {
        contentType: 'text/csv',
        cacheControl: '3600',
      });

    if (rawUploadError) {
      throw new Error(`Error uploading raw file: ${rawUploadError.message}`);
    }

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
          content: csvData
        }
      ],
      temperature: 0.3,
    });

    const processedCsv = completion.choices[0].message.content;
    const processedFilename = `processed-${randomFourDigit}-${Date.now()}.csv`;

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


    return new Response(
      JSON.stringify({
        success: true,
        filename: processedFilename,
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