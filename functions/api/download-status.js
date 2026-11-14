import { handleDownloadStatus } from "../_lib/private-download.mjs";

export const onRequestGet = ({ request, env }) => handleDownloadStatus(request, env);
