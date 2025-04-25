import Joi from "joi"

export const customerSearch = {
    key: Joi.string().min(3).required(),
    visitTypeId: Joi.number().integer().positive().required(),
}
export const customerGet = {
    id: Joi.number().optional(),
    code: Joi.string().optional()
}

// export const visitSave = {
//     user_id: Joi.number().min(1).required(),
//     lob_id: Joi.number().min(1).required(),
//     company_id: Joi.number().min(1).required(),
//     visit_type_id: Joi.number().min(1).required(),
//     customer_id: Joi.number().min(1).required(),
//     amc_id: Joi.number().min(1).required(),
//     visit_status_id: Joi.number().min(1).required(),
    
// }
export const startvisit = {
    user_id: Joi.number().integer().positive().required(),
    lob_id: Joi.number().integer().positive().required(),
    company_id: Joi.number().integer().positive().required(),
    model_id: Joi.number().integer().positive().required(),
    chassis_no: Joi.string().required(),
    visit_type_id: Joi.number().integer().positive().required(),
    job_from_latitude: Joi.string().required(),
    job_from_longitude: Joi.string().required(),
    user_image_url: Joi.string().allow(null, '').optional(),
    userimage: Joi.alternatives().try(
        Joi.object()
            .keys({
                fileName: Joi.string().allow(null, '').optional(),
                size: Joi.number().allow(null, '').optional(),
                base64: Joi.string().allow(null, '').optional(),
                mimetype: Joi.string().allow(null, '').optional(),
                uri: Joi.string().allow(null, '').optional(),
            })
            .optional(),
        Joi.string().allow('')
    ),
    customer_id: Joi.number().integer().positive().required(),
    amc_id: Joi.number().integer().min(0).optional(),
    job_wrk_start_time: Joi.string().required(),
    visit_date: Joi.date().required(), 
    oem_id: Joi.number().integer().min(0).optional(),
    machine_model: Joi.number().integer().min(0).optional(),
    engine_no: Joi.string().allow(null, '').optional(),
    reg_no: Joi.string().allow(null, '').optional(),
    visit_number:Joi.string().allow(null, '').optional(),
    vid:Joi.string().allow(null, '').optional(),
};

export const visitdetails = {
    item_details: Joi.string().required(), // TEXT field, allows large strings
    parts_requirement: Joi.string().required(), // TEXT field, allows large strings
    attachment: Joi.string().allow(null, '').optional(), // Can be TEXT or file path
    job_wrk_end_time: Joi.string().required(),
};