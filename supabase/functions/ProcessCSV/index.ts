import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};


const MB = 1024 * 1024;
//assistants csv allows max 512MB

//assistants starter code https://community.openai.com/t/how-to-modify-a-spreadsheet-using-openai-api-and-download-the-updated-file-via-python-script/943573
//contact this guy about starter code: razvan.i.savin@gmail.com.
//http://web.archive.org/web/20240823073123/https://github.com/SavinRazvan/flexiai/


Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {

    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const { csvData } = await req.json()
    const csvBlob = new Blob([atob(csvData)], { type: 'text/csv' });

    const randomFourDigit = Math.floor(1000 + Math.random() * 9000);

    const rawFilename = `raw-${randomFourDigit}-${Date.now()}.csv`;

    console.log("Started raw file upload");

    // Upload the processed CSV back to Supabase Storage
    const { data: rawUploadData, error: rawUploadError } = await supabaseClient
      .storage
      .from('csv-exports')
      .upload(rawFilename, csvBlob);

    if (rawUploadError) {
      throw new Error(`Error uploading raw file: ${rawUploadError.message}`);
    }
    
    console.log("Finished raw file upload");

    
    // Process with OpenAI
    console.log("Started OpenAI call");
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a CSV data processor. Analyze the following CSV data and enhance it. 
                   Return ONLY the processed CSV content in the same format, with potential improvements 
                   such as data cleaning, standardization, or enrichment.`
        },
        {
          role: 'user',
          content: 'Please create a CSV containing two columns for US state name and abbreviation. For example, California CA.'
        }
      ],
      temperature: 0.3,
      stream: false,
    });
    console.log("Finished OpenAI call");

    const processedCsv = completion.choices[0].message.content;
    console.log(processedCsv);

    const processedFilename = `processed-${randomFourDigit}-${Date.now()}.csv`;

    console.log("Started processed file upload");

    // Upload the processed CSV back to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('csv-exports')
      .upload(processedFilename, processedCsv, {
        contentType: 'text/csv',
        cacheControl: '3600',
      });

    console.log("Finished processed file upload");

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
    console.error(error);
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