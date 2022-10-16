import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param) => {
    return !isNaN(parseInt(param));
}
