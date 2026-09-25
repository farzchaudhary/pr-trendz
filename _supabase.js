import { createClient } from '@supabase/supabase-js';
export function getSupabase(){const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error('Cloud database is not configured yet.');return createClient(url,key,{auth:{persistSession:false}})}
export function owner(req){return req.headers['x-owner-code']===process.env.OWNER_CODE}
export function map(p){return {...p,originalPrice:p.original_price,meeshoLink:p.meesho_link}}
