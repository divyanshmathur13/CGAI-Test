import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: any = {
  projectId: '',
  empID: '',
};


const queryParamsSlice = createSlice({
  name: 'queryParams',
  initialState,
  reducers: {
  
    setProjectID(state, action: PayloadAction<string>) {
      state.projectId = action.payload;
    },

    setEmpID(state, action: PayloadAction<string>) {
      state.empID = action.payload;
    },

    resetQueryParams(state) {
      state.projectId = '';
      state.empID = '';
    },
  },
});


export const { setProjectID, setEmpID, resetQueryParams } = queryParamsSlice.actions;


export default queryParamsSlice.reducer;
