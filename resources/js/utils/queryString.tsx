const getQueryString = (query: Record<string, string>) => {
    let queryStr = "";
    Object.keys(query).forEach((qk) => {
        if (qk !== "page") {
            queryStr += `${qk}=${query[qk] !== null ? query[qk] : ""}&`
        }
    });

    return queryStr.slice(0, -1);
}

export default getQueryString;
