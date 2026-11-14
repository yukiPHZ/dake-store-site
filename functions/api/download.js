import { handleDownload } from "../_lib/private-download.mjs";

export const onRequestGet = ({ request, env }) => handleDownload(request, env);
