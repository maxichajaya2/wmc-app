import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
interface Props {
    children: React.ReactNode;
    className?: string;
}
export function FadeInComponent({
    children, className
}: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={cn('', className)}
        >
            {children}
        </motion.div>
    )
}
