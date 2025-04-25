import response from '../config/responses.json';
export class Responses {
    static getResponse(errorCode: number, errorMessage: string, data: any) {
        switch(errorCode) {
        case 200:
            response.meta.type="success";break
        case 201:
            response.meta.type="created";break
        case 204:
            response.meta.type="deleted";break
        case 206:
            response.meta.type="deleted";break
        case 400:
            response.meta.type="Invalid Request";break
        case 401:
            response.meta.type="Unauthorized Requests";break
        case 403:
            response.meta.type="Forbidden";break
        case 404:
            response.meta.type="Resource Not Found";
            break
        case 500:
            response.meta.type="Server Issue";break
        }
        response.meta.code = errorCode;
        response.meta.message = errorMessage;
        if(data) {
            response.meta.rows = data.length
        }
        response.data=data;
        return response;
    }
}
 
export default Responses;