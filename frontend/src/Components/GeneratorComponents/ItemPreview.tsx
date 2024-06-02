import { memo } from "react";

interface PreviewProps {
    content: string | File | undefined
}
const ItemPreview = memo(({content}: PreviewProps) => {
    if (!content) {
        return <></>;
    }
    if (typeof content == 'string') {
        return <span>{content}{content.length > 7 && "..."}</span>
    } else {
        return <span><img src={window.URL.createObjectURL(content)} /></span>
    }
})

export default ItemPreview;