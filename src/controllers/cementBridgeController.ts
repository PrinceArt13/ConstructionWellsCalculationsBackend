import { Request, Response } from "express";

class cementBridgeController {
    // Расчет установки цементного моста в открытом стволе скважины
    async cementBridgeInstallation(req: Request, res: Response): Promise<void> {
        const {
            BufferFluid, // Буферная жидкость (вода / отсутствует)
            PipeType, // Тип трубы (Трубы с внутрь высаженными концами / Гладкопроходные трубы)
            // Площади (м^2)
            CrossSectionArea, // Поперечное сечение скважины на участке установки цементного моста
            RingSpaceArea, // Кольцевое пространство между стенками скважины и колонной труб, по которой прокачивают указанные жидкости в том же участке
            InternalPassageChannelArea, // Внутреннего проходного канала колонны
            //
            BridgeHeight, // Высота моста (м)
            InternalPipeColumnVolume // Внутренний объём колонны труб (м^3)
        } = req.body;

        // TODO: В таблице надо будет сделать селект в котором можно будет выбирать тип цемент

        let k1, k2, k3, k4; // Эмпирические коэффициенты

        // Получение эмпирических переменных в соответствии с таблицей
        if (PipeType == 0) {
            if (BufferFluid == 0) {
                k1 = 0.05;
                k2 = 0.02;
                k3 = 0.4;
                k4 = 0.97;
            }
            else {
                k1 = 0.1;
                k2 = 0, k3 = 0;
                k4 = 0.94;
            }
        }
        else {
            if (BufferFluid == 0) {
                k1 = 0.025;
                k2 = 0.02;
                k3 = 0.4;
                k4 = 0.98;
            }
            else {
                k1 = 0.055;
                k2 = 0, k3 = 0;
                k4 = 0.97;
            }
        }

        // 1. Объём тампонажного раствора
        const PluggingVolume = CrossSectionArea * BridgeHeight + k1 * InternalPipeColumnVolume; // в формуле V(прописная т) == Vт ???

        // 2. Объёмы прокачиваемых порций буферной жидкости
        // 2.1 Перед тампонажным раствором
        const BufferFluidVolume1 = k2 * InternalPipeColumnVolume + k3 * RingSpaceArea * BridgeHeight;

        // 2.2 Вслед за тампонажным раствором
        const BufferFluidVolume2 = k2 * InternalPipeColumnVolume;

        // 3. Объём продавочной жидкости
        const ChaserVolume = k4 * InternalPipeColumnVolume - InternalPassageChannelArea * BridgeHeight;


        // todo: ещё какойто расчёт через резерв

        res.status(200).json({
            PluggingVolume: PluggingVolume.toFixed(3),
            BufferFluidVolume1: BufferFluidVolume1.toFixed(3),
            BufferFluidVolume2: BufferFluidVolume2.toFixed(3),
            ChaserVolume: ChaserVolume.toFixed(3)
        });
    }

    async cementBridgeInstallationOnBalance(req: Request, res: Response): Promise<void> { //точно то? не сходится страница с пунктом
        const {
            cementBridgeHeight, // Длина цементного моста (м)
            runningVolumeCasingString, // Погонный объём открытого ствола или обсадной колонны (м^3/м)
            excessVolume, // ИЗбыточный объём для работы по цементированию (%)

            buffer1Volume, // Объём буфера, закачиваемый перед цементным мостом (м^3)
            runningCapacityRing, // Погонная вместимость кольца между скважиной и колонной (м/м^3)
            runningVolumeInnerPipe, // Погонный объём внутренней полости трубы (м^3/м)

            drillPipeLength, // Длина бурильных труб или НКТ - насосно-компрессорные трубы (фут)
        } = req.body


        const requiredCementCount = cementBridgeHeight * runningVolumeCasingString * (1 + excessVolume / 100); // Количество цемента, требующееся для заданной длины цементного моста (кг)
        const buffer2Volume = (runningCapacityRing / (1 + excessVolume / 100)) * buffer1Volume * runningVolumeInnerPipe; // Объём буфера, закачиваемый после цементного моста (м^3)
        const salesVolume = (drillPipeLength - cementBridgeHeight) * runningVolumeInnerPipe - buffer2Volume; // Объём продавки, требующийся для размещения моста (барр)

        //todo: добавить в свагер 
        // и визуализировать расчеты в виде изображения, с указания интервалов буфера, цементного моста. Интервалов перфорации и конструкции скважины
        res.status(200).json({
            requiredCementCount: requiredCementCount.toFixed(3),
            buffer2Volume: buffer2Volume.toFixed(3),
            salesVolume: salesVolume.toFixed(3),
        });
    }
}

export default new cementBridgeController();