import * as React from 'react';

interface IAddLayerButtonProps {
    onClick: (e: React.MouseEvent) => void,
    text:string,

}

const AddLayerButton: React.FC<IAddLayerButtonProps> = ({ onClick,text }) => {
    return (
        <button id='btnAddLayer' onClick={onClick} className="addLayerButton">{text}</button>
    )
}
export { AddLayerButton };

