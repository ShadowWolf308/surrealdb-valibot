import { Bound, BoundExcluded, BoundIncluded, Decimal, Duration, Future, GeometryCollection, GeometryLine, GeometryMultiLine, GeometryMultiPoint, GeometryMultiPolygon, GeometryPoint, GeometryPolygon, Range, RecordId, RecordIdRange, StringRecordId, Table, Uuid } from "surrealdb";
import { BaseIssue, BaseSchema, check, custom, InferOutput, object, parse, pipe, safeParse, string, undefined as UndefinedSchema } from "valibot";

// SECTION - Decimal

export const DecimalSchema = custom<Decimal>((v) => v instanceof Decimal, "Value is not a valid Decimal");

// !SECTION
// SECTION - Duration

export const DurationSchema = custom<Duration>((v) => v instanceof Duration, "Value is not a valid Duration");

// !SECTION
// SECTION - Future

export const FutureSchema = custom<Future>((v) => v instanceof Future, "Value is not a valid Future");

// !SECTION
// SECTION - Geometry

export const GeometryPointSchema = custom<GeometryPoint>((v) => v instanceof GeometryPoint, "Value is not a valid GeometryPoint");
export const GeometryLineSchema = custom<GeometryLine>((v) => v instanceof GeometryLine, "Value is not a valid GeometryLine");
export const GeometryPolygonSchema = custom<GeometryPolygon>((v) => v instanceof GeometryPolygon, "Value is not a valid GeometryPolygon");
export const GeometryMultiPointSchema = custom<GeometryMultiPoint>((v) => v instanceof GeometryMultiPoint, "Value is not a valid GeometryMultiPoint");
export const GeometryMultiLineSchema = custom<GeometryMultiLine>((v) => v instanceof GeometryMultiLine, "Value is not a valid GeometryMultiLine");
export const GeometryMultiPolygonSchema = custom<GeometryMultiPolygon>((v) => v instanceof GeometryMultiPolygon, "Value is not a valid GeometryPolygon");
export const GeometryCollectionSchema = custom<GeometryCollection>((v) => v instanceof GeometryCollection, "Value is not a valid GeometryCollection");

// !SECTION
// SECTION - Range

export function RangeSchema<Beg  extends BaseSchema<unknown, unknown, BaseIssue<unknown>>, End  extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(begValueSchema: Beg, endValueSchema: End) {
	const getBoundSchema = (bound: Bound<unknown>, schema: Beg | End) => {
		return bound instanceof BoundIncluded ? BoundIncludedSchema(schema) : (bound instanceof BoundExcluded ? BoundExcludedSchema(schema) : UndefinedSchema());
	}

	return pipe(
		custom<Range<InferOutput<Beg>, InferOutput<End>>>(
			(v) => v instanceof Range,
			"Value is not a valid Range",
		),
		check((v) => safeParse(getBoundSchema(v.beg, begValueSchema), v.beg?.value).success, "Beg value of Range is not valid"),
		check((v) => safeParse(getBoundSchema(v.end, endValueSchema), v.end?.value).success, "End value of Range is not valid"),
	);
}
export function BoundIncludedSchema<T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(valueSchema: T) {
	return pipe(
		custom<BoundIncluded<T>>(
			(v) => v instanceof BoundIncluded,
			"Value is not a valid BoundIncluded",
		),
		check(
			(v) => safeParse(valueSchema, v.value).success,
			"Value of BoundExcluded is not valid",
		),
	)
}
export function BoundExcludedSchema<T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(valueSchema: T) {
	return pipe(
		custom<BoundExcluded<T>>(
			(v) => v instanceof BoundExcluded,
			"Value is not a valid BoundIncluded",
		),
		check(
			(v) => safeParse(valueSchema, v.value).success,
			"Value of BoundExcluded is not valid",
		),
	);
}
export const RecordIdRangeSchema = custom<RecordIdRange>((v) => v instanceof RecordIdRange, "Value is not a valid RecordIdRange");
export function RecordIdRangeSchemaOf<Tb extends string>(table: Tb) {
	parse(string(), table);

	return custom<RecordIdRange<Tb>>(
		(v) => v instanceof RecordIdRange && v.tb === table,
		`Value is not a valid RecordIdRange or is not from table: ${table}`,
	);
}

// !SECTION
// SECTION - RecordId

export const RecordIdSchema = custom<RecordId>((value) => value instanceof RecordId, "Value is not a valid RecordId");
export function RecordIdSchemaOf<Tb extends string>(table: Tb) {
	parse(string(), table);

	return custom<RecordId<Tb>>(
		(value) => value instanceof RecordId && value.tb === table,
		`Value is not a valid RecordId or is not from table: ${table}`,
	);
}
export const StringRecordIdSchema = custom<StringRecordId>((value) => value instanceof StringRecordId, "Value is not a valid StringRecordId");

// SECTION - helpers

export const RecordSchema = object({
	id: RecordIdSchema,
});
export function RecordSchemaOf<Tb extends string>(table: Tb) {
	return object({
		id: RecordIdSchemaOf(table),
	});
}

// !SECTION
// !SECTION
// SECTION - Table

export const TableSchema = custom<Table>((v) => v instanceof Table, "Value is not a valid Table");
export function TableSchemaOf<Tb extends string>(table: Tb) {
	parse(string(), table);

	return custom<Table<Tb>>(
		(v) => v instanceof Table && v.tb === table,
		`Value is not a valid Table or is not from table: ${table}`,
	);
}

// !SECTION
// SECTION - Uuid

export const UuidSchema = custom<Uuid>((v) => v instanceof Uuid, "Value is not a valid Uuid");

// !SECTION
// SECTION - Types of Helperes
// SECTION - RecordId

export type Record = InferOutput<typeof RecordSchema>;
export type RecordOf<Tb extends string = string> = InferOutput<ReturnType<typeof RecordSchemaOf<Tb>>>;

// !SECTION
// !SECTION