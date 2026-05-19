import dns from "dns";

const checkInternet =
  () => {
    return new Promise((resolve) => {

      dns.lookup("google.com", (err) => {
        if (err) {
          resolve(false);
        }
        else {
          resolve(true);
        }
      });
    });
  };

export default checkInternet;