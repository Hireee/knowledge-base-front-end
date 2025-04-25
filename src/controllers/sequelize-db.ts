import { QueryTypes } from "sequelize";
import { sequelize } from "@tvsmobility/tvs-universe-model/build/database";

class AppModel {
    public createData = async ($model: any, $data: any) => {
        const res = await $model.create($data);
        return res;
    };

    public updateData = async ($model: any, $condition: any, $data: any) => {
        const res = await $model.update($data, { where: $condition });
        return res;
    };
    public getAll = async ($model: any, $condition: any, $associations: any) => {
        try {
            let associate = []
            if ($associations) {
                associate = $associations
            }
            const data = await $model.findAll({
                include: associate,
                order: [["id", "DESC"]],
                where: $condition,
                raw:true
            });
            return data;
        } catch (error) {
            console.log(error,'erorrrrrrrr')
            throw new Error("Failed to fetch data");
        }
    };
    public getOne = async ($model: any, $condition: any) => {
        const res = await $model.findOne({ where: $condition });
        return res;
    };
    public delete = async ($model: any, $condition: any, $data: any) => {
        try {
            const deletedAt = new Date();
            await $model.update($data, { where: $condition });
            return {
                success: true,
                message: 'Deleted Successfully',
            };
        }
        catch (error) {
            throw new Error('Error in removing data');
        }
    };
    public getRawData = async ($sql: any) => {
        try {
            const [results, metadata] = await sequelize.query($sql, { type: QueryTypes.RAW });
            return results;
        } catch (error) {
            console.error('Error executing raw SELECT query:', error);
            throw error;
        }
    };
    public updateRawData = async ($sql: any, $condition: any) => {
        try {
            const [results, metadata] = await sequelize.query($sql, { type: QueryTypes.UPDATE });
            return results;
        } catch (error) {
            console.error('Error executing raw UPDATE query:', error);
            throw error;
        }
    };
}
const appModel = new AppModel();
export default appModel;
