import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param) => {
    const month = parseInt(param);

    if (isNaN(month) || (month < 1 || month > 12)) {
        return false;
    }

    return true;
}
