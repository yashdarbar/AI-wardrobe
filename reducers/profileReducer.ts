export interface ProfileState {
    username: string;
    website: string;
    gender: string | null;
    bodyType: string | null;
    fitPreference: string | null;
    selectedStyles: string[];
    prefColors: string[];
}

export type ProfileAction =
    | { type: "SET_TEXT"; field: "username" | "website"; value: string }
    | { type: "SET_SINGLE"; field: "gender" | "bodyType" | "fitPreference"; value: string }
    | { type: "TOGGLE_STYLE"; value: string }
    | { type: "TOGGLE_COLOR"; value: string }
    | { type: "RESET" };

export const initialState: ProfileState = {
    username: "Jane Doe",
    website: "",
    gender: null,
    bodyType: null,
    fitPreference: null,
    selectedStyles: [],
    prefColors: [],
}

export function profileReducer(
    state: ProfileState,
    action: ProfileAction
): ProfileState {
    switch (action.type) {
        case "SET_TEXT":
            return { ...state, [action.field]: action.value };

        case "SET_SINGLE":
            return { ...state, [action.field]: action.value };

        case "TOGGLE_STYLE":
            const styleExists = state.selectedStyles.includes(action.value);
            return {
                ...state,
                selectedStyles: styleExists
                    ? state.selectedStyles.filter((s) => s !== action.value)
                    : [...state.selectedStyles, action.value],
            };

        case "TOGGLE_COLOR":
            const colorExists = state.prefColors.includes(action.value);
            return {
                ...state,
                prefColors: colorExists
                    ? state.prefColors.filter((c) => c !== action.value)
                    : [...state.prefColors, action.value],
            };

        case "RESET":
            return initialState;

        default:
            return state;
    }
}