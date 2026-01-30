"use client"

import { useFormContext } from "react-hook-form";
import { StepContainer } from "../../../components/ui/step-container";
import { FormField } from "../../../components/ui/form-field";

interface LocationStepProps {
    role?: 'carer' | 'supporter';
}

const LocationStep = ({ role }: LocationStepProps) => {
    const { register, formState: { errors } } = useFormContext();
    const isRequired = role !== "carer";

    return (
        <StepContainer description={`お住まいの地域を教えてください。${!isRequired ? "（任意）" : ""}`}>
            <FormField label="都道府県" name="prefecture" error={errors.prefecture}>
                <select 
                    {...register("prefecture", { required: isRequired ? "都道府県を選択してください" : false })} 
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                >
                    <option value="">選択してください</option>
                    <option value="神奈川県">神奈川県</option>
                    {/* 他の都道府県を追加 */}
                </select>
            </FormField>

            <FormField label="市区町村" name="city" error={errors.city}>
                <input 
                    type="text" 
                    {...register("city", { required: isRequired ? "市区町村を入力してください" : false })} 
                    placeholder="例：横浜市中区" 
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                />
            </FormField>

            {role === "carer" && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <FormField label="公開設定" name="locationVisibility">
                        <select 
                            {...register("locationVisibility")} 
                            className="w-full p-2 border rounded bg-white"
                        >
                            <option value="public">所在地を公開する</option>
                            <option value="prefectureOnly">都道府県のみ公開する</option>
                            <option value="private">公開しない</option>
                        </select>
                    </FormField>
                </div>
            )}
        </StepContainer>
    )
};

LocationStep.title = "居住地";

export default LocationStep;