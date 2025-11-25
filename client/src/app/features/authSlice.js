
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",

    initialState: {
        token: null,
        user: null,
        loading: true,
    },

    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.loading = false;       // FIX
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },

        logout: (state) => {
            state.token = "";
            state.user = null;
            state.loading = false;       // FIX
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
