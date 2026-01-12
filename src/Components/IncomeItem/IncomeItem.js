import React from 'react'
import styled from 'styled-components'
import { dateFormat } from '../../utils/dateFormat';
import { bitcoin, book, calender, card, circle, clothing, comment, dollar, edit, food, freelance, medical, money, piggy, stocks, takeaway, trash, tv, users, yt } from '../../utils/Icons';
import Button from '../Button/Button';

function IncomeItem({
    id,
    title,
    amount,
    date,
    category,
    description,
    deleteItem,
    indicatorColor,
    type,
    onEdit
}) {

    const categoryIcon = () =>{
        switch(category) {
            case 'salary':
                return money;
            case 'freelancing':
                return freelance
            case 'investments':
                return stocks;
            case 'stocks':
                return users;
            case 'bitcoin':
                return bitcoin;
            case 'bank':
                return card;
            case 'youtube':
                return yt;
            case 'other':
                return piggy;
            default:
                return money
        }
    }

    const expenseCatIcon = () => {
        switch (category) {
            case 'education':
                return book;
            case 'groceries':
                return food;
            case 'health':
                return medical;
            case 'subscriptions':
                return tv;
            case 'takeaways':
                return takeaway;
            case 'clothing':
                return clothing;
            case 'travelling':
                return freelance;
            case 'other':
                return circle;
            default:
                return circle
        }
    }

    const handleEdit = () => {
        onEdit({
            id,
            title,
            amount,
            date,
            category,
            description,
            type
        })
    }

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            deleteItem(id)
        }
    }

    return (
        <IncomeItemStyled indicator={indicatorColor}>
            <div className="icon">
                {type === 'expense' ? expenseCatIcon() : categoryIcon()}
            </div>
            <div className="content">
                <h5>{title}</h5>
                <div className="inner-content">
                    <div className="text">
                        <p className="amount">{dollar} {amount.toFixed(2)}</p>
                        <p className="date">{calender} {dateFormat(date)}</p>
                        <p className="description">
                            {comment}
                            {description}
                        </p>
                    </div>
                    <div className="btn-con">
                        <Button 
                            icon={edit}
                            bPad={'0.8rem'}
                            bRad={'50%'}
                            bg={'var(--color-accent)'}
                            color={'#fff'}
                            onClick={handleEdit}
                            title="Edit"
                        />
                        <Button 
                            icon={trash}
                            bPad={'0.8rem'}
                            bRad={'50%'}
                            bg={'var(--color-delete)'}
                            color={'#fff'}
                            onClick={handleDelete}
                            title="Delete"
                        />
                    </div>
                </div>
            </div>
        </IncomeItemStyled>
    )
}

const IncomeItemStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    color: #222260;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 5px 25px rgba(0, 0, 0, 0.1);
    }
    
    .icon{
        width: 80px;
        height: 80px;
        border-radius: 20px;
        background: #F5F5F5;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
        
        i{
            font-size: 2.6rem;
            color: var(--color-accent);
        }
    }

    .content{
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: .5rem;
        
        h5{
            font-size: 1.4rem;
            padding-left: 2rem;
            position: relative;
            font-weight: 600;
            color: var(--primary-color);
            
            &::before{
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: .8rem;
                height: .8rem;
                border-radius: 50%;
                background: ${props => props.indicator};
            }
        }

        .inner-content{
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .text{
                display: flex;
                align-items: center;
                gap: 1.5rem;
                flex-wrap: wrap;
                
                p{
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--primary-color);
                    opacity: 0.8;
                    font-size: 0.9rem;
                    
                    &.amount {
                        font-weight: 600;
                        font-size: 1.1rem;
                        color: var(--color-green);
                    }
                    
                    &.date {
                        color: var(--primary-color);
                    }
                    
                    &.description {
                        max-width: 200px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    
                    i {
                        font-size: 0.8rem;
                        opacity: 0.6;
                    }
                }
            }
            
            .btn-con{
                display: flex;
                gap: 0.5rem;
                
                button {
                    transition: all 0.3s ease;
                    
                    &:hover {
                        transform: scale(1.1);
                    }
                    
                    &:active {
                        transform: scale(0.95);
                    }
                }
            }
        }
    }
    
    @media (max-width: 768px) {
        padding: 1rem;
        
        .icon {
            width: 60px;
            height: 60px;
            
            i {
                font-size: 2rem;
            }
        }
        
        .content {
            .inner-content {
                flex-direction: column;
                align-items: flex-start;
                gap: 1rem;
                
                .text {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.5rem;
                }
            }
        }
    }
`;

export default IncomeItem