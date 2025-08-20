"use client"
import { LoadingLayout } from '@/components/global/parts/loading_layout';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/lib/supabaseClient';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const ProtectedLayout = ({children}:{children:React.ReactNode}) => {
    const {session , loading} = useSession();
    const router = useRouter();
    useEffect(()=>{
        if (loading) return; // ローディング中は何もしない
        if (!session) {
          router.push("/login");
          return;
        }

        const initialize = async ()=>{
            const user_id =session.user.id;
            if(!user_id){
              alert("アカウントが取得できませんでした")
              return router.push("/login")
            }
            const {data:profile,error:profileError} = await supabase.from("user_profiles").select("role").eq("user_id", user_id);
            if (profileError) {
              console.log(profileError)
              alert("アカウント情報を取得できませんでした");
              return router.push("/login");
            }
            if(profile[0].role === "admin"){
                console.log("admin");
            }else{
                alert("adminのみ閲覧可")
                return router.back();
            }
        }
        initialize();
        console.log(session,loading);
    },[loading,session,router])
    
  return (
    <div>
            <div className="fixed top-0 left-0 z-[9999]">
              <LoadingLayout></LoadingLayout>
            </div> 
            <div className="z-0">
              {children}
            </div>
            
        </div>
    
  ) 
}

export default ProtectedLayout