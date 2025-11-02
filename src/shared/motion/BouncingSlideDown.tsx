import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
    isVisible: boolean;
    children: React.ReactNode;
    className?: string;
}
export function BouncingSlideDown({
    isVisible, children, className
}: Props) {
    const variants = {
        hidden: { y: -20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.1,
                ease: 'easeOut',
            },
        },
        exit: { y: -20, opacity: 0, transition: { duration: 0.1, ease: 'easeIn' } },
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    className={cn('', className)}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
