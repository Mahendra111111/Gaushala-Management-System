(()=>{var e={};e.id=709,e.ids=[709],e.modules={2507:(e,t,s)=>{"use strict";s.d(t,{U:()=>c});var r=s(34386),a=s(44999);async function c(){let e=await (0,a.UL)();return(0,r.createServerClient)("https://dxkvwzuattslquqiuncq.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4a3Z3enVhdHRzbHF1cWl1bmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MTk2MTEsImV4cCI6MjA4NDM5NTYxMX0.L9IEiIiz6PYzoH7G_eoVnTbDafNPGc7Dy4jzI5DjkJ8",{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:s,options:r})=>e.set(t,s,r))}catch{}}}})}},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:e=>{"use strict";e.exports=require("punycode")},27910:e=>{"use strict";e.exports=require("stream")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},34631:e=>{"use strict";e.exports=require("tls")},39727:()=>{},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},47990:()=>{},51906:e=>{function t(e){var t=Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}t.keys=()=>[],t.resolve=t,t.id=51906,e.exports=t},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},60978:(e,t,s)=>{"use strict";s.r(t),s.d(t,{patchFetch:()=>I,routeModule:()=>p,serverHooks:()=>N,workAsyncStorage:()=>T,workUnitAsyncStorage:()=>d});var r={};s.r(r),s.d(r,{GET:()=>l,POST:()=>E,dynamic:()=>n});var a=s(96559),c=s(48088),o=s(37719),i=s(2507),u=s(32190);let n="force-dynamic";async function l(){try{let e=await (0,i.U)(),t={success:!0,messages:[]};try{let{error:s}=await e.rpc("execute_sql",{sql_query:`
          CREATE TABLE IF NOT EXISTS public.cows (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tracking_id TEXT NOT NULL,
            gender TEXT NOT NULL,
            health_status TEXT NOT NULL DEFAULT 'healthy',
            source TEXT NOT NULL,
            adopter_name TEXT,
            photo_url TEXT,
            notes TEXT,
            age NUMERIC,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            created_by UUID REFERENCES auth.users(id)
          );
          
          -- Set up RLS if table was just created
          ALTER TABLE public.cows ENABLE ROW LEVEL SECURITY;
          
          -- Create policies if they don't exist
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE tablename = 'cows' AND policyname = 'Enable read access for all users'
            ) THEN
              CREATE POLICY "Enable read access for all users" ON public.cows
                FOR SELECT USING (true);
            END IF;
            
            IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE tablename = 'cows' AND policyname = 'Enable insert for authenticated users'
            ) THEN
              CREATE POLICY "Enable insert for authenticated users" ON public.cows
                FOR INSERT WITH CHECK (auth.role() = 'authenticated');
            END IF;
            
            IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE tablename = 'cows' AND policyname = 'Enable update for authenticated users'
            ) THEN
              CREATE POLICY "Enable update for authenticated users" ON public.cows
                FOR UPDATE USING (auth.role() = 'authenticated');
            END IF;
          END $$;
        `});s?t.messages.push(`Error creating table: ${s.message}`):t.messages.push("Cow table setup successful")}catch(e){t.messages.push(`Table setup error: ${e.message}`)}try{let{error:s}=await e.rpc("execute_sql",{sql_query:`
          CREATE TABLE IF NOT EXISTS public.activity_logs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            activity_type TEXT NOT NULL,
            description TEXT NOT NULL,
            entity_id UUID,
            created_by UUID REFERENCES auth.users(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );
          
          -- Set up RLS if table was just created
          ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
          
          -- Create policies if they don't exist
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE tablename = 'activity_logs' AND policyname = 'Enable read access for authenticated users'
            ) THEN
              CREATE POLICY "Enable read access for authenticated users" ON public.activity_logs
                FOR SELECT USING (auth.role() = 'authenticated');
            END IF;
            
            IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE tablename = 'activity_logs' AND policyname = 'Enable insert for authenticated users'
            ) THEN
              CREATE POLICY "Enable insert for authenticated users" ON public.activity_logs
                FOR INSERT WITH CHECK (auth.role() = 'authenticated');
            END IF;
          END $$;
        `});s?t.messages.push(`Error creating logs table: ${s.message}`):t.messages.push("Activity logs table setup successful")}catch(e){t.messages.push(`Logs table setup error: ${e.message}`)}try{let{error:s}=await e.rpc("execute_sql",{sql_query:`
          CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
          RETURNS JSONB AS $$
          DECLARE
            result JSONB;
          BEGIN
            EXECUTE sql_query;
            result := '{"success": true}'::JSONB;
            RETURN result;
          EXCEPTION WHEN OTHERS THEN
            result := jsonb_build_object(
              'success', false,
              'error', SQLERRM,
              'detail', SQLSTATE
            );
            RETURN result;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `});s?t.messages.push(`Error creating SQL function: ${s.message}`):t.messages.push("SQL execution function created successfully")}catch(e){t.messages.push(`Function setup error: ${e.message}`)}try{await e.storage.createBucket("cow-images",{public:!0,fileSizeLimit:0xa00000}),t.messages.push("Storage bucket created or already exists");let{error:s}=await e.rpc("execute_sql",{sql_query:`
          -- Create policy for public access to objects in cow-images bucket
          BEGIN;
          
          -- Create policy for public access
          INSERT INTO storage.policies (name, bucket_id, definition)
          VALUES (
            'Public Access',
            'cow-images',
            '(bucket_id = ''cow-images'')'
          )
          ON CONFLICT (name, bucket_id) DO NOTHING;
          
          -- Create policy for authenticated users to upload
          INSERT INTO storage.policies (name, bucket_id, definition, operation)
          VALUES (
            'Authenticated users can upload',
            'cow-images',
            '(bucket_id = ''cow-images'' AND auth.role() = ''authenticated'')',
            'INSERT'
          )
          ON CONFLICT (name, bucket_id, operation) DO NOTHING;
          
          COMMIT;
        `});s?t.messages.push(`Warning - policy setup: ${s.message}`):t.messages.push("Storage policies created successfully")}catch(e){e.message&&e.message.includes("already exists")?t.messages.push("Storage bucket already exists"):t.messages.push(`Bucket setup error: ${e.message}`)}return u.NextResponse.json(t)}catch(e){return console.error("Direct setup error:",e),u.NextResponse.json({success:!1,error:e.message||"Unknown error"},{status:500})}}async function E(e){try{let t=await (0,i.U)(),{type:s}=await e.json();if("storage"===s){try{let{data:e}=await t.storage.listBuckets();e?.find(e=>"cow-images"===e.name)||await t.storage.createBucket("cow-images",{public:!0,fileSizeLimit:0xa00000})}catch(e){console.error("Error creating bucket:",e)}try{let e=await fetch("/api/db-setup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sql:`
              -- Enable RLS on buckets table
              ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
              
              -- Create bucket policies
              BEGIN;
              DROP POLICY IF EXISTS "Allow public access" ON storage.buckets;
              CREATE POLICY "Allow public access" ON storage.buckets FOR SELECT USING (true);
              
              DROP POLICY IF EXISTS "Allow authenticated users to create buckets" ON storage.buckets;
              CREATE POLICY "Allow authenticated users to create buckets" ON storage.buckets
                FOR INSERT WITH CHECK (auth.role() = 'authenticated');
              
              -- Enable RLS on objects table
              ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
              
              -- Create object policies
              DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
              CREATE POLICY "Allow public read access" ON storage.objects
                FOR SELECT USING (bucket_id = 'cow-images');
              
              DROP POLICY IF EXISTS "Allow authenticated insert" ON storage.objects;
              CREATE POLICY "Allow authenticated insert" ON storage.objects
                FOR INSERT WITH CHECK (bucket_id = 'cow-images' AND auth.role() = 'authenticated');
              
              DROP POLICY IF EXISTS "Allow authenticated update" ON storage.objects;
              CREATE POLICY "Allow authenticated update" ON storage.objects
                FOR UPDATE USING (bucket_id = 'cow-images' AND auth.role() = 'authenticated');
              
              DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;
              CREATE POLICY "Allow authenticated delete" ON storage.objects
                FOR DELETE USING (bucket_id = 'cow-images' AND auth.role() = 'authenticated');
              COMMIT;
            `})}),t=await e.json();if(!t.success)return u.NextResponse.json({success:!1,error:`DB setup failed: ${t.error||"Unknown error"}`},{status:500})}catch(e){return u.NextResponse.json({success:!1,error:`DB setup error: ${e.message||"Unknown error"}`},{status:500})}return u.NextResponse.json({success:!0})}return u.NextResponse.json({success:!1,error:"Invalid setup type"},{status:400})}catch(e){return console.error("Direct setup error:",e),u.NextResponse.json({success:!1,error:e.message||"Unknown error"},{status:500})}}let p=new a.AppRouteRouteModule({definition:{kind:c.RouteKind.APP_ROUTE,page:"/api/direct-setup/route",pathname:"/api/direct-setup",filename:"route",bundlePath:"app/api/direct-setup/route"},resolvedPagePath:"C:\\Users\\owner\\Downloads\\gaushala_project-main V6\\gaushala_project-main\\gaushala_project-main\\src\\app\\api\\direct-setup\\route.ts",nextConfigOutput:"standalone",userland:r}),{workAsyncStorage:T,workUnitAsyncStorage:d,serverHooks:N}=p;function I(){return(0,o.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:d})}},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:e=>{"use strict";e.exports=require("zlib")},76926:(e,t,s)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"createDedupedByCallsiteServerErrorLoggerDev",{enumerable:!0,get:function(){return u}});let r=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var s=a(t);if(s&&s.has(e))return s.get(e);var r={__proto__:null},c=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if("default"!==o&&Object.prototype.hasOwnProperty.call(e,o)){var i=c?Object.getOwnPropertyDescriptor(e,o):null;i&&(i.get||i.set)?Object.defineProperty(r,o,i):r[o]=e[o]}return r.default=e,s&&s.set(e,r),r}(s(61120));function a(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,s=new WeakMap;return(a=function(e){return e?s:t})(e)}let c={current:null},o="function"==typeof r.cache?r.cache:e=>e,i=console.warn;function u(e){return function(...t){i(e(...t))}}o(e=>{try{i(c.current)}finally{c.current=null}})},78335:()=>{},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")},96487:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[447,398,410,580],()=>s(60978));module.exports=r})();