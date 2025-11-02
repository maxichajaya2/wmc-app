import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Highlight, themes } from "prism-react-renderer"
import { Bug, BugOff } from "lucide-react"
import { useDebugger } from "./store/debugger.store"
import { useCallback, useEffect, useState } from "react"


const JsonViewer = () => {
    const json = useDebugger(state => state.data)
    const [jsonString, setJsonString] = useState('')

    useEffect(() => {
        setJsonString(JSON.stringify(json, null, 2))
    }, [json])

    return (
        <Highlight theme={themes.nightOwl} code={jsonString} language="json">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={`${className} p-4 rounded text-sm overflow-auto max-h-96`} style={style}>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    )
}

export const Debugger = () => {
    const { toast } = useToast()
    const isToastVisible = useDebugger(state => state.isToastVisible)
    const setIsToastVisible = useDebugger(state => state.setIsToastVisible)
    const showJsonToast = useDebugger(state => state.showJsonToast)

    const handleShowJsonToast = useCallback(() => {
        if (!isToastVisible) {
            toast({
                title: "JSON Data",
                description: <JsonViewer />,
                duration: Infinity,
                className: "w-auto max-w-[90vw] bottom-4 left-4 fixed",
            })
        }
    }, [isToastVisible, toast, showJsonToast])

    const hideJsonToast = () => {
        setIsToastVisible(false)
    }

    return (
        <div className="p-4 space-y-4 flex flex-col">
            <Button onClick={handleShowJsonToast} className="h-8 w-8 m-0 rounded-full p-1.5 text-white" variant={'warning'}>
                <Bug className="h-6 w-6" />
            </Button>
            {isToastVisible && <Button onClick={hideJsonToast} className="h-8 w-8 m-0 rounded-full p-1.5 text-white" variant={'destructive'}>
                <BugOff className="h-6 w-6" />
            </Button>}
        </div>
    )
}
