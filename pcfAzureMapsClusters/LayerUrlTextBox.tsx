import * as React from 'react';

interface ILayerUrlTextBoxProps {
    onUrlChange: (url: string) => void
    url: string
}

const LayerUrlTextbox: React.FC<ILayerUrlTextBoxProps> = ({ onUrlChange, url }) => {
    return (
        <div>
            <input type="text" value={url} onChange={e => onUrlChange(e.currentTarget.value)} className="css-input" />
        </div>
        
    )
}
export { LayerUrlTextbox };