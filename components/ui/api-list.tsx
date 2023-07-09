"use client"

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import ApiAlert from "./api-alert";

interface ApiListProps {
    entityName: string,
    entityIdName: string,
}

const ApiList: React.FC<ApiListProps> = ({
    entityName,
    entityIdName,
}) => {
    const params = useParams();
    const origin = useOrigin();

    const baseURL = `${origin}/api/${params.storeId}`;

    return (
        <>
            <ApiAlert
                title="GET"
                description={`${baseURL}/${entityName}`}
                variant="public"
            />
            <ApiAlert
                title="GET"
                description={`${baseURL}/${entityName}/{${entityIdName}}`}
                variant="public"
            />
            <ApiAlert
                title="POST"
                description={`${baseURL}/${entityName}`}
                variant="admin"
            />
            <ApiAlert
                title="PUT"
                description={`${baseURL}/${entityName}/{${entityIdName}}`}
                variant="admin"
            />
            <ApiAlert
                title="DELETE"
                description={`${baseURL}/${entityName}/{${entityIdName}}`}
                variant="admin"
            />
        </>
    );
}

export default ApiList;