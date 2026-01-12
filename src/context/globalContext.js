import React, { useContext, useState } from "react"
import api from "../utils/axios"

const GlobalContext = React.createContext()

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [editingItem, setEditingItem] = useState(null)

    const addIncome = async (income) => {
        setLoading(true)
        setError(null)
        try {
            await api.post("/api/v1/add-income", income)
            await getIncomes()
            setLoading(false)
            return { success: true }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add income")
            setLoading(false)
            return { success: false }
        }
    }

    const getIncomes = async () => {
        try {
            const response = await api.get("/api/v1/get-incomes")
            setIncomes(response.data)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch incomes")
        }
    }

    const updateIncome = async (id, incomeData) => {
        setLoading(true)
        setError(null)
        try {
            await api.put(`/api/v1/update-income/${id}`, incomeData)
            await getIncomes()
            setEditingItem(null)
            setLoading(false)
            return { success: true }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update income")
            setLoading(false)
            return { success: false }
        }
    }

    const deleteIncome = async (id) => {
        setError(null)
        try {
            await api.delete(`/api/v1/delete-income/${id}`)
            await getIncomes()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete income")
        }
    }

    const totalIncome = () => {
        let total = 0
        incomes.forEach(i => {
            total += i.amount
        })
        return total
    }

    const addExpense = async (expense) => {
        setLoading(true)
        setError(null)
        try {
            await api.post("/api/v1/add-expense", expense)
            await getExpenses()
            setLoading(false)
            return { success: true }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add expense")
            setLoading(false)
            return { success: false }
        }
    }

    const getExpenses = async () => {
        try {
            const response = await api.get("/api/v1/get-expenses")
            setExpenses(response.data)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch expenses")
        }
    }

    const updateExpense = async (id, expenseData) => {
        setLoading(true)
        setError(null)
        try {
            await api.put(`/api/v1/update-expense/${id}`, expenseData)
            await getExpenses()
            setEditingItem(null)
            setLoading(false)
            return { success: true }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update expense")
            setLoading(false)
            return { success: false }
        }
    }

    const deleteExpense = async (id) => {
        setError(null)
        try {
            await api.delete(`/api/v1/delete-expense/${id}`)
            await getExpenses()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete expense")
        }
    }

    const totalExpenses = () => {
        let total = 0
        expenses.forEach(e => {
            total += e.amount
        })
        return total
    }

    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        return history.slice(0, 3)
    }

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            updateIncome,
            deleteIncome,
            totalIncome,
            expenses,
            addExpense,
            getExpenses,
            updateExpense,
            deleteExpense,
            totalExpenses,
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
