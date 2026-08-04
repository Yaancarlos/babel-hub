import DynamicModalForm from "../../../../../components/ui/modals/ModalForm.tsx";
import type { modeTypes } from "../../../../types/types.ts";
import { useState } from "react";
import type { Assessment } from "../../types";

interface AssessmentFormModalProps {
    mode: modeTypes;
    assessment: Assessment | null;
    assessmentId: string | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export function AssessmentFormModal({ mode, assessmentId, assessment, onCancel, onSuccess }: AssessmentFormModalProps) {
    const isCreateMode = mode == "create";
    const [formModal, setFormModal] = useState({
        name: assessment?.name || "",
        weight: assessment?.weight || "",
    })

    return (
        <DynamicModalForm
            isOpen={true}
            title={isCreateMode ? `Añadir template` : `Editar template`}
            fields={gradingFields}
            formData={formModal}
            formError={error}
            formLoading={loading}
            onClose={onCancel}
            onChange={formChange}
            onSubmit={handleUpsertGradingTemplate}
        />
    )
}