import { ParsedQs } from 'qs';

interface QueryParserConfig {
    defaultLimit?: number;
    maxLimit?: number;
    allowedFields?: string[];
    dateFields?: string[];
}

export const parsePrismaQuery = (
    req: { query: ParsedQs },
    options: QueryParserConfig = {}
): {
    skip: number;
    take: number;
    where: any;
    orderBy: any;
    select: any;
} => {
    const config = {
        defaultLimit: 100,
        maxLimit: 1000,
        allowedFields: [],
        dateFields: [],
        ...options,
    };

    // 1. Pagination
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(
        parseInt(req.query.limit as string) || config.defaultLimit,
        config.maxLimit
    );
    const skip = (page - 1) * limit;

    // 2. Sorting
    const orderBy: any = [];
    const sortParam = req.query.sort as string | undefined;

    if (sortParam) {
        sortParam.split(',').forEach(part => {
            const [field, direction] = part.split(':');
            const validDirection = direction?.toLowerCase() === 'desc' ? 'desc' : 'asc';
            if (field && config.allowedFields?.includes(field)) {
                orderBy.push({ [field]: validDirection });
            }
        });
    }

    // 3. Field Selection
    const select: any = {};
    const fieldsParam = req.query.fields as string | undefined;

    if (fieldsParam) {
        fieldsParam.split(',').forEach(field => {
            if (config.allowedFields?.includes(field)) {
                select[field] = true;
            }
        });
    } else {
        options.allowedFields?.forEach((value) => {
            select[value] = true
        })
    }

    // 4. Filtering
    const where: any = {};
    const filterParams = { ...req.query };
    delete filterParams.page;
    delete filterParams.limit;
    delete filterParams.sort;
    delete filterParams.fields;

    for (const [key, value] of Object.entries(filterParams)) {
        const [field, operator] = key.split(/\[(.*)\]/).filter(Boolean);

        if (!field || !config.allowedFields?.includes(field)) continue;

        const finalOperator = operator || 'equals';
        let parsedValue: any = value;

        // Handle boolean values
        if (value === 'true') parsedValue = true;
        if (value === 'false') parsedValue = false;

        // Handle date fields
        if (config.dateFields?.includes(field)) {
            const dateValue = new Date(value as string);
            if (!isNaN(dateValue.getTime())) {
                parsedValue = dateValue;
            } else {
                continue;
            }
        }
        // Handle numeric values
        else if (!isNaN(Number(value))) {
            parsedValue = parseFloat(value as string);
        }

        if (!where[field]) where[field] = {};
        where[field][finalOperator] = parsedValue;
    }

    return {
        skip,
        take: limit,
        where: Object.keys(where).length > 0 ? where : undefined,
        orderBy: orderBy.length > 0 ? orderBy : undefined,
        select: Object.keys(select).length > 0 ? select : undefined,
    };
};