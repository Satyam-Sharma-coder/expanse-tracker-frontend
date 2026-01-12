import React from 'react'
import styled from 'styled-components'

function Button({name, icon, onClick, bg, bPad, color, bRad, disabled, type = "button", title}) {
    return (
        <ButtonStyled 
            style={{
                background: bg,
                padding: bPad,
                borderRadius: bRad,
                color: color,
            }} 
            onClick={onClick}
            disabled={disabled}
            type={type}
            title={title}
        >
            {icon}
            {name}
        </ButtonStyled>
    )
}

const ButtonStyled = styled.button`
    outline: none;
    border: none;
    font-family: inherit;
    font-size: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    cursor: pointer;
    transition: all .3s ease-in-out;
    font-weight: 500;
    
    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        filter: brightness(1.1);
    }
    
    &:active:not(:disabled) {
        transform: translateY(0);
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
    
    i {
        font-size: 1rem;
    }
`;

export default Button