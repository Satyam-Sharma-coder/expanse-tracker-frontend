import React, { useContext, useState } from "react"
import axios from 'axios'

const BASE_URL = process.env.REACT_APP_BASE_URL



const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {
    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [editingItem, setEditingItem] = useState(null)

    // Income functions
    const addIncome = async (income) => {
    setLoading(true)
    setError(null)
    try {
        await axios.post(`${BASE_URL}/api/v1/add-income`, income)
        await getIncomes()
        setLoading(false)
        return { success: true }
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to add income')
        setLoading(false)
        return { success: false }
    }
}

const getIncomes = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/get-incomes`)
        setIncomes(response.data)
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch incomes')
    }
}

const updateIncome = async (id, incomeData) => {
    setLoading(true)
    setError(null)
    try {
        await axios.put(`${BASE_URL}/api/v1/update-income/${id}`, incomeData)
        await getIncomes()
        setEditingItem(null)
        setLoading(false)
        return { success: true }
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to update income')
        setLoading(false)
        return { success: false }
    }
}

const deleteIncome = async (id) => {
    setError(null)
    try {
        await axios.delete(`${BASE_URL}/api/v1/delete-income/${id}`)
        await getIncomes()
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete income')
    }
}


    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) => {
            totalIncome = totalIncome + income.amount
        })
        return totalIncome;
    }

    // Expense functions
    const addExpense = async (expense) => {
    setLoading(true)
    setError(null)
    try {
        await axios.post(`${BASE_URL}/api/v1/add-expense`, expense)
        await getExpenses()
        setLoading(false)
        return { success: true }
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to add expense')
        setLoading(false)
        return { success: false }
    }
}

const getExpenses = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/get-expenses`)
        setExpenses(response.data)
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch expenses')
    }
}

const updateExpense = async (id, expenseData) => {
    setLoading(true)
    setError(null)
    try {
        await axios.put(`${BASE_URL}/api/v1/update-expense/${id}`, expenseData)
        await getExpenses()
        setEditingItem(null)
        setLoading(false)
        return { success: true }
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to update expense')
        setLoading(false)
        return { success: false }
    }
}

const deleteExpense = async (id) => {
    setError(null)
    try {
        await axios.delete(`${BASE_URL}/api/v1/delete-expense/${id}`)
        await getExpenses()
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete expense')
    }
}


    const totalExpenses = () => {
        let totalExpense = 0;
        expenses.forEach((expense) => {
            totalExpense = totalExpense + expense.amount
        })
        return totalExpense;
    }

    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })
        return history.slice(0, 3)
    }

    return (
        <GlobalContext.Provider value={{
            // Income
            addIncome,
            getIncomes,
            incomes,
            updateIncome,
            deleteIncome,
            totalIncome,
            
            // Expense
            expenses,
            addExpense,
            getExpenses,
            updateExpense,
            deleteExpense,
            totalExpenses,
            
            // General
            totalBalance,
            transactionHistory,
            error,
            setError,
            loading,
            editingItem,
            setEditingItem
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
} 
