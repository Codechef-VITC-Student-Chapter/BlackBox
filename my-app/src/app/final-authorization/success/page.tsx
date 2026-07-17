"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { useRouter } from "next/navigation";

const loadingSteps = [
  "Preparing Judge...",
  "Loading Compiler...",
  "Generating Test Cases...",
  "System Ready.",
];


export default function SuccessPage() {

  const router = useRouter();

  const [step, setStep] = useState(0);
  const [showTitle, setShowTitle] = useState(false);



  useEffect(() => {

    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 2500);



    const interval = setInterval(() => {

      setStep((prev)=>{

        if(prev < loadingSteps.length - 1){
          return prev + 1;
        }

        clearInterval(interval);

        return prev;

      });


    },1000);



    const navigateTimer = setTimeout(()=>{

      router.push(
        "/engineer-certification"
      );

    },7500);



    return ()=>{

      clearTimeout(titleTimer);
      clearTimeout(navigateTimer);
      clearInterval(interval);

    };


  },[router]);



  return (

    <PageTransition>


      <motion.div

        initial={{
          opacity:0
        }}

        animate={{
          opacity:1
        }}

        transition={{
          duration:1
        }}

        className="
        min-h-[90vh]
        w-full
        bg-black
        flex
        items-center
        justify-center
        overflow-hidden
        relative
        "

      >



        {/* Glitch Overlay */}


        <motion.div

          animate={{
            opacity:[
              0,
              1,
              0,
              1,
              0
            ],

            x:[
              0,
              -10,
              10,
              -5,
              0
            ]

          }}

          transition={{
            duration:1.5,
            repeat:2
          }}

          className="
          absolute
          inset-0
          bg-primary/5
          pointer-events-none
          "

        />





        <div className="
        text-center
        font-mono
        space-y-8
        ">



          <motion.p

            initial={{
              opacity:0
            }}

            animate={{
              opacity:1
            }}

            className="
            text-primary
            tracking-widest
            text-xl
            "

          >

            FINAL BARRIER DESTROYED

          </motion.p>




          <motion.p

            initial={{
              opacity:0
            }}

            animate={{
              opacity:1
            }}

            transition={{
              delay:1
            }}

            className="
            text-white
            tracking-widest
            "

          >

            SECURE CHANNEL ESTABLISHED

          </motion.p>






          {
            showTitle && (

              <motion.h1

                initial={{
                  opacity:0,
                  scale:0.8
                }}

                animate={{
                  opacity:1,
                  scale:1
                }}

                className="
                text-5xl
                md:text-7xl
                font-bold
                tracking-widest
                text-primary
                "

              >

                ENGINEER
                <br/>
                CERTIFICATION

              </motion.h1>

            )
          }





          {
            showTitle && (

            <motion.div

              initial={{
                opacity:0
              }}

              animate={{
                opacity:1
              }}

              transition={{
                delay:.5
              }}

              className="
              text-secondary-text
              text-lg
              space-y-4
              "

            >

              {
                loadingSteps
                .slice(0,step+1)
                .map((item,index)=>(

                  <motion.p

                    key={index}

                    initial={{
                      opacity:0,
                      x:-20
                    }}

                    animate={{
                      opacity:1,
                      x:0
                    }}

                  >

                    {">"} {item}

                  </motion.p>

                ))
              }


            </motion.div>

            )
          }




          {
            step === loadingSteps.length-1 && (

              <motion.p

                animate={{
                  opacity:[1,0.5,1]
                }}

                transition={{
                  repeat:Infinity,
                  duration:1
                }}

                className="
                text-primary
                pt-6
                "

              >

                SYSTEM READY

              </motion.p>

            )
          }



        </div>



      </motion.div>


    </PageTransition>

  );

}