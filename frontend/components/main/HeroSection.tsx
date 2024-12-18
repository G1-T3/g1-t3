import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * HeroSection component renders the main hero section of the application.
 * It includes animated elements such as an image, heading, paragraph, and buttons.
 * The animations are triggered after a short delay to ensure the component is fully mounted.
 *
 * @component
 * @example
 * return (
 *   <HeroSection />
 * )
 *
 * @returns {JSX.Element} The rendered hero section component.
 *
 * @remarks
 * This component uses the `useState` and `useEffect` hooks to manage the animation state.
 * It also utilizes the `motion` components from the `framer-motion` library for animations.
 *
 * @function
 * @name HeroSection
 *
 * @hook
 * @name useState
 * @description Manages the `shouldAnimate` state to control the visibility of animations.
 *
 * @hook
 * @name useEffect
 * @description Sets a timeout to update the `shouldAnimate` state after the component mounts.
 *
 * @constant
 * @name fadeInUp
 * @description Defines the animation variants for the fade-in-up effect.
 *
 * @returns {JSX.Element} The rendered hero section component.
 */
export default function HeroSection() {
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        // Set a small timeout to ensure the component is fully mounted
        const timer = setTimeout(() => setShouldAnimate(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full text-foreground p-4">
            <div className="bg-[radial-gradient(circle closest-side, #292826 16%, #181716 58%)]">
                <motion.div
                    className="text-center mb-8 mt-8"
                    initial="hidden"
                    animate={shouldAnimate ? "visible" : "hidden"}
                    variants={fadeInUp}
                    transition={{ duration: 0.8 }}
                >
                    <motion.img
                        className="w-[20vw] sm:w-[10vw] md:w-[7vw] h-auto mx-auto rounded-full"
                        variants={{
                            hidden: { scale: 0 },
                            visible: { scale: 1 }
                        }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                        src="/heroGIF.gif"
                        alt="Quagmire GIF"
                        width={200}
                        height={200}
                    />
                    <motion.h1
                        className="text-4xl md:text-6xl pb-4 font-bold mb-4 mt-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-pink to-secondary-blue line-height-1.5"
                        variants={fadeInUp}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Quagmire
                    </motion.h1>
                    <motion.p
                        className="text-xl text-muted-foreground mb-8"
                        variants={fadeInUp}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        Welcome to the ultimate arm wrestling platform
                        <br />
                        Compete against others in solo queue or tournaments
                        <br />
                        Rise to the top and claim your title as the arm wrestling champion
                    </motion.p>
                    <motion.div
                        variants={fadeInUp}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="flex justify-center font-mono text-sm text-muted-foreground">
                        <p>Start your journey today</p>
                    </motion.div>
                </motion.div>
                <motion.div
                    className="relative w-full max-w-5xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={shouldAnimate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <Image
                        src="/headerImg.png"
                        alt="Hero image"
                        width={1920}
                        height={1080}
                        className="rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background rounded-lg" />
                </motion.div>
            </div>
        </div>
    );
}