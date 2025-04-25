import axios from "axios";

class HrmsApiService {
    constructor() {}

    public async getEmployeeDetaileByCode(code: any, token: any) {
        const apiUrl = `https://hrms.tvs.in/hrms-laravel/api/employees/get-employee-details`;
        const requestHeaders = {
            "Content-Type": "application/json", // Adjust content type based on API requirements
            ApiToken: `${token}`, // Example of including an authorization token
        };

        // Data to be sent in the request body
        const requestData = {
            filter: {
                EmployeeIdOrName: code,
            },
        };

        try {
            const response = await axios.post(apiUrl, requestData, {
                headers: requestHeaders,
            });
            return response.data;
        } catch (error: any) {
            console.error("Error making POST request:", error.message);
            throw error;
        }
    }


    public async getToken(companyCode: any) {
        const requestData = {
            "company":{"code":companyCode ? companyCode : "VMS"},
            "password":"Aapi@0987",
            "use_ad_password":false,
            "username":"api-user"

        };
        const apiUrl = `https://hrms.tvs.in/hrms-laravel/api/get-auth-token-by-code
`;
        try {
            const response = await axios.post(apiUrl, requestData);
            return response.data;
        } catch (error: any) {
            console.error("Error making POST request:", error.message);
            throw error;
        }
    }

    public async sendOtpService(otp:any,mobileNumber:any) {
        const apiUrl =`http://api.instaalerts.zone/SendSMS/sendmsg.php?uname=Riplmotolog&pass=n)7Md$8A&send=TVSMTL&dest=${mobileNumber}&msg=${otp}%20is%20your%20one-time%20password(OTP)%20-%20TVS%20MOTOLOG`
        try {
            const response = await axios.get(apiUrl);
            return response.data;
        }catch(error:any) {
            throw error;
        }
    }
}

const hrmsApiService = new HrmsApiService();
export default hrmsApiService;