import React, { type FunctionComponent, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { api, useIsLoggedIn , setToken } from '$/lib/api'
import { useRouter } from 'next/router'


import styles from  './index.module.css';

export const ActionArea: FunctionComponent = () => {

    const isLoggedIn = useIsLoggedIn();
    const ctx = api.useUtils()
    const { push } = useRouter()
  
    // Get current user
    const { data: { user } = {}, isLoading } = api.auth.me.useQuery(undefined, {
      enabled: isLoggedIn,
    });


    return (
      <>
      <div className={styles.userinfo}>
        {
            user &&
            <div className={styles.action}>
               <div className={styles.username}>
                    {user.username}
                </div>
                <button
                    className="btn btn-outline-danger"
                
                    type={'button'}
                    disabled={isLoading}
                    onClick={() => {
                    setToken(null)

                    // Hard reset all user data on the page
                    ctx.auth.me.reset().catch(console.error)

                    push('/register').catch(console.error)
                    }}
                >
                    退出.
              </button>
            </div> 
         
        }
      </div>
      {
            user && <>
                <div className={styles.buttonArea}>
        <button   
            className="btn btn-outline-success"
            type={'button'}
        >
            开始今日任务
        </button>
        <br></br>
        <button   
            className="btn btn-outline-success"
            type={'button'}
        >
            查看任务
        </button>
        <br></br>
        <button
            className="btn btn-outline-success"
            type={'button'}
        >
            教程学习
        </button>
      </div>
            </>
      }
  
      </>
    )
  }
  