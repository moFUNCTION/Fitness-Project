import React, { startTransition, useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig/axiosInstance";
import { useAuth } from "../../Context/UserDataContextProvider/UserDataContextProvder";
export const useFetch = ({ endpoint, params, headers, ...rest }) => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const getData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(endpoint, {
        params,
        headers: headers || {
          Authorization: `Bearer ${user.data.token}`,
        },
        ...rest,
      });
      startTransition(() => setData(res.data));

      setError(undefined);
    } catch (err) {
      setError(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const HandleRender = () => getData();
  useEffect(() => {
    getData();
  }, [JSON.stringify(params), endpoint]);
  return {
    data,
    loading,
    error,
    HandleRender,
  };
};
