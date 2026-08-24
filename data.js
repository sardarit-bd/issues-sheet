function analyzeQuery(query) {

    let semanticQuery = query;
    const queryArray = query?.split(' ');
  
    const country= queryArray?.includes("Australia");
    const established = queryArray?.includes("before");
    const year = queryArray?.includes("1990");
  


    const sqlFilters = {
      country: country ? "Australia":"",
      establishedBefore: established && year ? 1990:""
    };

    semanticQuery = semanticQuery?.replace('in Australia established before 1990',"");

    return {
        sqlFilters,
        semanticQuery
    };

}

console.log(analyzeQuery("Engineering universities in Australia established before 1990"));
