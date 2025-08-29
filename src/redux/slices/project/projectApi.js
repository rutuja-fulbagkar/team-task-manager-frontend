import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { api } from "../../../utils/api";

export const findProject = createAsyncThunk(
  "project/findProject",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/projects?limit=${values?.limit || 25}&page=${
          (values?.page ?? 0) + 1
        }&status=${values?.status || ""}&search=${
          values?.search || ""
        }&timeRange=${values?.timeRange || ""}&startDate=${
          values?.startDate ? values?.startDate : ""
        }&endDate=${values?.endDate ? values?.endDate : ""}`
      );

      console.log("hsdiudad",response);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getProjectbyId = createAsyncThunk(
  "project/getProject",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/projects/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const deleteProjectbyId = createAsyncThunk(
  "project/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/projects/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const findProjectWithoutPagination = createAsyncThunk(
  "project/findProject",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/projects/all`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
export const createProject = createAsyncThunk(
  "project/createProject",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/projects`, data);
      if (response?.status === 201) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "project/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/users`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
 export const addMembers = createAsyncThunk(
  "project/addMembers",
  async (data, { rejectWithValue }) => {
    try {
      console.log("afsgfasfyasfyas",data);
      const response = await api.post(`/api/projects/${data?.projectId}/members`, data);
      if (response?.status === 201) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const editProject = createAsyncThunk(
  "project/editProject",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/projects/${data?.paramsId}`,
        data?.data
      );
      if (response.status === 200) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const setDateServices = createAsyncThunk(
  "project/setDateServices",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/services/date/${data?.paramsId}`,
        data?.data
      );
      if (response.status === 200) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);



export const createSalesOrderbyexcel = createAsyncThunk(
  "service/createServicebyexcel",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/projects/order", {
        excelData: values,
      });
      if (response.status === 200) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data.message);
    }
  }
);




// task api

export const getTasksByProject = createAsyncThunk(
  "task/findTask",
  async (projectId, { rejectWithValue }) => {
    
    try {
      const response = await api.get(`api/tasks/projects/${projectId}/tasks`);
      console.log("getTasksByProjectresponse", response);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
 


export const createTask = createAsyncThunk(
  "task/createTask",
  async (data, { rejectWithValue }) => {
    try {
      console.log("jkajskajskajsjasj",data);
      const response = await api.post(`/api/tasks/projects/${data?.project}/tasks`, data);
      if (response?.status === 201) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
export const editTask = createAsyncThunk(
  "task/editTask",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/tasks/${data?.taskId}`,
        data?.data
      );
      if (response.status === 200) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
export const deleteTaskbyId = createAsyncThunk(
  "task/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/tasks/${taskId}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const activitiesTaskbyId = createAsyncThunk(
  "task/activitiesTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/tasks/${taskId}/activities`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


