import {
	type Bound,
	BoundExcluded,
	BoundIncluded,
	DateTime,
	Decimal,
	Duration,
	FileRef,
	Future,
	Geometry,
	GeometryCollection,
	GeometryLine,
	GeometryMultiLine,
	GeometryMultiPoint,
	GeometryMultiPolygon,
	GeometryPoint,
	GeometryPolygon,
	Range,
	RecordId,
	RecordIdRange,
	type RecordIdValue,
	StringRecordId,
	Table,
	Uuid,
} from "surrealdb";
import {
	type ArraySchema,
	type BaseIssue,
	type BaseSchema,
	type BigintSchema,
	type CustomSchema,
	check,
	custom,
	type InferOutput,
	type NumberSchema,
	type ObjectEntries,
	type ObjectSchema,
	object,
	parse,
	pipe,
	type StringSchema,
	safeParse,
	string,
	undefined as valiUndefined,
} from "valibot";

/**
 * @private
 */
function getValueType(value: unknown): string {
	if (typeof value === "object") {
		if (value === null) {
			return "null";
		}

		return value.constructor.name;
	}

	return typeof value;
}

/**
 * @private
 */
interface ErrorMessageOptions {
	expected: string;
	input: unknown;
	isLiteral?: boolean;
}

/**
 * @private
 */
function constructErrorMessage({ expected, input, isLiteral = false }: ErrorMessageOptions): string {
	const inputType = isLiteral ? input : getValueType(input);

	return `Invalid input: expected ${expected}, received ${inputType}`;
}

/**
 * @private
 */
function getBoundSchema<T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(bound: Bound<unknown>, schema: T) {
	return bound instanceof BoundIncluded
		? BoundIncludedSchema(schema)
		: bound instanceof BoundExcluded
			? BoundExcludedSchema(schema)
			: valiUndefined();
}

/**
 * @private
 */
type RecordIdValueSchema =
	| StringSchema<string>
	| NumberSchema<string>
	| CustomSchema<Uuid, string>
	| BigintSchema<string>
	| ObjectSchema<ObjectEntries, string>
	| ArraySchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, string>;

// SECTION - DateTime

export const DateTimeSchema = custom<DateTime>(
	(v) => v instanceof DateTime,
	(issue) => {
		return constructErrorMessage({
			expected: "DateTime",
			input: issue.input,
		});
	},
);

// !SECTION
// SECTION - Decimal

export const DecimalSchema = custom<Decimal>(
	(v) => v instanceof Decimal,
	(issue) => {
		return constructErrorMessage({
			expected: "Decimal",
			input: issue.input,
		});
	},
);

// !SECTION
// SECTION - Duration

export const DurationSchema = custom<Duration>(
	(v) => v instanceof Duration,
	(issue) => {
		return constructErrorMessage({
			expected: "Duration",
			input: issue.input,
		});
	},
);

// !SECTION
// SECTION - File

export const FileRefSchema = custom<FileRef>(
	(v) => v instanceof FileRef,
	(issue) => {
		return constructErrorMessage({
			expected: "FileRef",
			input: issue.input,
		});
	},
);

// !SECTION
// SECTION - Future

export const FutureSchema = custom<Future>(
	(v) => v instanceof Future,
	(issue) => {
		return constructErrorMessage({
			expected: "Future",
			input: issue.input,
		});
	},
);

// !SECTION
// SECTION - Geometry

export const GeometrySchema = custom<Geometry>(
	(v) => v instanceof Geometry,
	(issue) => {
		return constructErrorMessage({
			expected: "GeometryPoint",
			input: issue.input,
		});
	},
);
export const GeometryPointSchema = custom<GeometryPoint>(
	(v) => v instanceof GeometryPoint,
	(issue) => {
		return constructErrorMessage({
			expected: "GeometryPoint",
			input: issue.input,
		});
	},
);
export const GeometryLineSchema = custom<GeometryLine>(
	(v) => v instanceof GeometryLine,
	(issue) => {
		return constructErrorMessage({
			expected: "GeometryLine",
			input: issue.input,
		});
	},
);
export const GeometryPolygonSchema = custom<GeometryPolygon>(
	(v) => v instanceof GeometryPolygon,
	(issue) => {
		return constructErrorMessage({
			expected: "GeometryPolygon",
			input: issue.input,
		});
	},
);
export const GeometryMultiPointSchema = custom<GeometryMultiPoint>(
	(v) => v instanceof GeometryMultiPoint,
	(issue) => {
		return constructErrorMessage({
			expected: "GeometryMultiPoint",
			input: issue.input,
		});
	},
);
export const GeometryMultiLineSchema = custom<GeometryMultiLine>(
	(v) => v instanceof GeometryMultiLine,
	(issue) => {
		return constructErrorMessage({
			expected: "GeometryMultiLine",
			input: issue.input,
		});
	},
);
export const GeometryMultiPolygonSchema = custom<GeometryMultiPolygon>(
	(v) => v instanceof GeometryMultiPolygon,
	(issue) => {
		return constructErrorMessage({
			expected: "GeometryMultiPolygon",
			input: issue.input,
		});
	},
);
export const GeometryCollectionSchema = custom<GeometryCollection>(
	(v) => v instanceof GeometryCollection,
	(issue) => {
		return constructErrorMessage({
			expected: "GeometryCollection",
			input: issue.input,
		});
	},
);

// !SECTION
// SECTION - Range

export function RangeSchema<
	Beg extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
	End extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(beginValueSchema: Beg, endValueSchema: End) {
	return pipe(
		custom<Range<InferOutput<Beg>, InferOutput<End>>>(
			(v) => v instanceof Range,
			(issue) => {
				return constructErrorMessage({
					expected: "Range",
					input: issue.input,
				});
			},
		),
		check(
			(v) => {
				return safeParse(getBoundSchema(v.begin, beginValueSchema), v.begin?.value).success;
			},
			(issue) => {
				const errorMessage = constructErrorMessage({
					expected: beginValueSchema.expects,
					input: issue.input.begin?.value,
				});

				return `Invalid begin value of Range: ${errorMessage}`;
			},
		),
		check(
			(v) => {
				return safeParse(getBoundSchema(v.end, endValueSchema), v.end?.value).success;
			},
			(issue) => {
				const errorMessage = constructErrorMessage({
					expected: endValueSchema.expects,
					input: issue.input.end?.value,
				});

				return `Invalid end value of Range: ${errorMessage}`;
			},
		),
	);
}
export function BoundIncludedSchema<T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(valueSchema: T) {
	return pipe(
		custom<BoundIncluded<T>>(
			(v) => v instanceof BoundIncluded,
			(issue) => {
				return constructErrorMessage({
					expected: "BoundIncluded",
					input: issue.input,
				});
			},
		),
		check(
			(v) => safeParse(valueSchema, v.value).success,
			(issue) => {
				const errorMessage = constructErrorMessage({
					expected: valueSchema.expects,
					input: issue.input.value,
				});

				return `Invalid inner value of BoundIncluded: ${errorMessage}`;
			},
		),
	);
}
export function BoundExcludedSchema<T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(valueSchema: T) {
	return pipe(
		custom<BoundExcluded<T>>(
			(v) => v instanceof BoundExcluded,
			(issue) => {
				return constructErrorMessage({
					expected: "BoundExcluded",
					input: issue.input,
				});
			},
		),
		check(
			(v) => safeParse(valueSchema, v.value).success,
			(issue) => {
				const errorMessage = constructErrorMessage({
					expected: valueSchema.expects,
					input: issue.input.value,
				});

				return `Invalid inner value of BoundExcluded: ${errorMessage}`;
			},
		),
	);
}
export const RecordIdRangeSchema = custom<RecordIdRange>(
	(v) => v instanceof RecordIdRange,
	"Value is not a valid RecordIdRange",
);
export function RecordIdRangeSchemaOf<Tb extends string, Id extends RecordIdValueSchema | undefined = undefined>(
	table: Tb,
	id?: Id,
) {
	parse(string(), table);

	return pipe(
		custom<
			RecordIdRange<
				Tb,
				Id extends BaseSchema<unknown, unknown, BaseIssue<unknown>> ? InferOutput<Id> : RecordIdValue
			>
		>(
			(v) => v instanceof RecordIdRange,
			(issue) => {
				return constructErrorMessage({
					expected: "BoundExcluded",
					input: issue.input,
				});
			},
		),
		check(
			(v) => {
				return safeParse(TableSchemaOf(table), v.table).success;
			},
			(issue) => {
				const parsed = safeParse(TableSchemaOf(table), issue.input.table);

				if (parsed.success) {
					throw new Error("Table value changed between original check and error message construction");
				}

				const errorMessage = parsed.issues.reduce((acc, parseIssue) => `${acc};${parseIssue.message}`, "");

				return `Invalid table value of RecordIdRange: ${errorMessage}`;
			},
		),
		check(
			(v) => {
				if (!id) {
					return true;
				}

				return safeParse(getBoundSchema(v.begin, id), v.begin).success;
			},
			(issue) => {
				if (!id) {
					throw new Error("Expected schema to exist");
				}

				const parsed = safeParse(getBoundSchema(issue.input.begin, id), issue.input.begin);

				if (parsed.success) {
					throw new Error("Begin value changed between original check and error message construction");
				}

				const errorMessage = parsed.issues.reduce((acc, parseIssue) => `${acc};${parseIssue.message}`, "");

				return `Invalid begin value of RecordIdRange: ${errorMessage}`;
			},
		),
		check(
			(v) => {
				if (!id) {
					return true;
				}

				return safeParse(getBoundSchema(v.end, id), v.end).success;
			},
			(issue) => {
				if (!id) {
					throw new Error("Expected schema to exist");
				}

				const parsed = safeParse(getBoundSchema(issue.input.end, id), issue.input.end);

				if (parsed.success) {
					throw new Error("End value changed between original check and error message construction");
				}

				const errorMessage = parsed.issues.reduce((acc, parseIssue) => `${acc};${parseIssue.message}`, "");

				return `Invalid end value of RecordIdRange: ${errorMessage}`;
			},
		),
	);
}

// !SECTION
// SECTION - RecordId

export const RecordIdSchema = custom<RecordId>(
	(value) => value instanceof RecordId,
	(issue) => {
		return constructErrorMessage({
			expected: "RecordId",
			input: issue.input,
		});
	},
);
export function RecordIdSchemaOf<Tb extends string, Id extends RecordIdValueSchema | undefined = undefined>(
	table: Tb,
	id?: Id,
) {
	return pipe(
		custom<
			RecordId<Tb, Id extends BaseSchema<unknown, unknown, BaseIssue<unknown>> ? InferOutput<Id> : RecordIdValue>
		>(
			(value) => value instanceof RecordId,
			(issue) => {
				return constructErrorMessage({
					expected: "RecordId",
					input: issue.input,
				});
			},
		),
		check(
			(v) => {
				return safeParse(TableSchemaOf(table), v.table).success;
			},
			(issue) => {
				const parsed = safeParse(TableSchemaOf(table), issue.input.table);

				if (parsed.success) {
					throw new Error("Table value changed between original check and error message construction");
				}

				const errorMessage = parsed.issues.reduce((acc, parseIssue) => `${acc};${parseIssue.message}`, "");

				return `Invalid table value of RecordId: ${errorMessage}`;
			},
		),
		check(
			(v) => {
				if (!id) {
					return true;
				}

				return safeParse(id, v.id).success;
			},
			(issue) => {
				if (!id) {
					throw new Error("Expected schema to exist");
				}

				const parsed = safeParse(id, issue.input.id);

				if (parsed.success) {
					throw new Error("Ud value changed between original check and error message construction");
				}

				const errorMessage = parsed.issues.reduce((acc, parseIssue) => `${acc};${parseIssue.message}`, "");

				return `Invalid id value of RecordId: ${errorMessage}`;
			},
		),
	);
}
export const StringRecordIdSchema = custom<StringRecordId>(
	(value) => value instanceof StringRecordId,
	(issue) => {
		return constructErrorMessage({
			expected: "RecordId",
			input: issue.input,
		});
	},
);

// SECTION - helpers

export const RecordSchema = object({
	id: RecordIdSchema,
});
export function RecordSchemaOf<Tb extends string, Id extends RecordIdValueSchema | undefined = undefined>(
	table: Tb,
	id?: Id,
) {
	return object({
		id: RecordIdSchemaOf(table, id),
	});
}

// !SECTION
// !SECTION
// SECTION - Table

export const TableSchema = custom<Table>(
	(v) => v instanceof Table,
	(issue) => {
		return constructErrorMessage({
			expected: "Table",
			input: issue.input,
		});
	},
);
export function TableSchemaOf<Tb extends string>(table: Tb) {
	return pipe(
		custom<Table<Tb>>(
			(v) => v instanceof Table,
			(issue) => {
				return constructErrorMessage({
					expected: "Table",
					input: issue.input,
				});
			},
		),
		check(
			(v) => v.name === table,
			(issue) => {
				const errorMessage = constructErrorMessage({
					expected: `"${table}"`,
					input: `"${issue.input.name}"`,
					isLiteral: true,
				});

				return `Invalid name value of Table: ${errorMessage}`;
			},
		),
	);
}

// !SECTION
// SECTION - Uuid

export const UuidSchema = custom<Uuid>(
	(v) => v instanceof Uuid,
	(issue) => {
		return constructErrorMessage({
			expected: "Uuid",
			input: issue.input,
		});
	},
);

// !SECTION
// SECTION - Types of Helperes
// SECTION - RecordId

export type Record = InferOutput<typeof RecordSchema>;
export type RecordOf<Tb extends string = string> = InferOutput<ReturnType<typeof RecordSchemaOf<Tb>>>;

// !SECTION
// !SECTION
