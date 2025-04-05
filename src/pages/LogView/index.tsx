import { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { ActivityLog } from "./data";
import { useGetPortfolioLogs } from "../../hooks/logApi";
import { useParams } from "react-router-dom";
import { ActivityLogTable } from "./ActivityLogTable";

export const LogView = () => {
  const { id } = useParams();
  const [logs, setLogs] = useState<ActivityLog[]>();
  const [getReq, getRes] = useGetPortfolioLogs();

  useEffect(() => {
    if (!id) {
      return;
    }
    getReq(id);
  }, [getReq, id]);

  useEffect(() => {
    if (getRes.called && getRes.data) {
      console.log(getRes.data);
      setLogs(getRes.data);
    }
  }, [getRes.called, getRes.data]);

  return <Layout>{<ActivityLogTable logs={logs || []} />}</Layout>;
};
