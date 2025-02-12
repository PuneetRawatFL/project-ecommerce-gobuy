function getAdmin() {
    // const user = document.cookie.match(/(^| )userId=([^;]+)/);
    // const userId = parseInt(user[2], 10);
    // console.log(userId);

    const match = document.cookie.match(/(^| )adminToken=([^;]+)/);
    // console.log(match[2]);

    // Decode the JWT using jwt-decode script
    const decoded = jwt_decode(match[2]);

    // Log the decoded payload
    // console.log("Decoded Payload:", decoded);

    const adminName = document.querySelector("#adminName");
    adminName.innerText = `${decoded.name}`;
}
getAdmin();
