"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { useRouter } from "next/navigation";
import { Crosshair } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";

export default function FireSequencePage() {

  const router = useRouter();
  const { playSound } = useAudio();

  const [fired, setFired] = useState(false);
  const [complete, setComplete] = useState(false);


  function fireWeapon() {

    if (fired) return;

    setFired(true);

    playSound("gunshot");


    setTimeout(() => {
      setComplete(true);
    }, 2500);


    setTimeout(() => {

      router.push(
        "/final-authorization/success"
      );

    }, 6000);

  }



  return (

    <PageTransition>

      <div
        onClick={fireWeapon}
        className={`
        min-h-[90vh]
        w-full
        flex
        items-center
        justify-center
        relative
        overflow-hidden
        bg-black
        cursor-crosshair

        ${
          fired
          ?
          "animate-shake"
          :
          ""
        }

        `}
      >


        {/* Crosshair */}

        {!fired && (

          <motion.div

            initial={{
              opacity:0
            }}

            animate={{
              opacity:1
            }}

            className="absolute text-primary"

          >

            <Crosshair
              size={90}
              strokeWidth={1}
            />

          </motion.div>

        )}





        {/* Firewall */}

        <AnimatePresence>


        {!complete && (

          <motion.div

            initial={{
              scale:1,
              opacity:1
            }}

            animate={
              fired
              ?
              {
                scale:0,
                opacity:0,
                rotate:20
              }
              :
              {}
            }

            transition={{
              duration:1.2
            }}

            className="
            absolute
            w-[350px]
            h-[350px]
            border
            border-primary
            bg-primary/10
            flex
            items-center
            justify-center
            "

          >

            <div className="
            text-primary
            font-mono
            tracking-widest
            text-xl
            ">

              DIGITAL FIREWALL

            </div>


          </motion.div>

        )}


        </AnimatePresence>





        {/* Muzzle Flash */}

        <AnimatePresence>

        {
          fired && (

            <motion.div

              initial={{
                scale:0,
                opacity:1
              }}

              animate={{
                scale:5,
                opacity:0
              }}

              transition={{
                duration:.5
              }}

              className="
              absolute
              w-40
              h-40
              rounded-full
              bg-white
              "

            />

          )
        }

        </AnimatePresence>






        {/* Shell + Messages */}

        <AnimatePresence>


        {
          complete && (

            <motion.div

              initial={{
                opacity:0,
                y:30
              }}

              animate={{
                opacity:1,
                y:0
              }}

              className="
              absolute
              text-center
              font-mono
              space-y-6
              "

            >


              <p className="
              text-primary
              text-3xl
              font-bold
              tracking-widest
              ">

                FIREWALL SHATTERED

              </p>



              <div className="
              text-white
              space-y-3
              text-lg
              ">

                <p>
                  Round Expended.
                </p>

                <p>
                  1 / 1
                </p>

                <p>
                  Weapon Locked.
                </p>

                <p className="text-primary">

                  Mission Complete.

                </p>


              </div>





              <motion.div

                animate={{
                  opacity:[1,0.3,1]
                }}

                transition={{
                  repeat:Infinity,
                  duration:1
                }}

                className="
                pt-8
                text-primary
                text-xl
                "

              >

                TRANSMITTING...

                <br/>

                ████████████████


              </motion.div>


            </motion.div>

          )
        }


        </AnimatePresence>



        {/* Initial instruction */}

        {
          !fired && (

            <div className="
            absolute
            bottom-20
            text-secondary-text
            font-mono
            animate-pulse
            ">

              CLICK TO FIRE

            </div>

          )
        }


      </div>


    </PageTransition>

  );
}