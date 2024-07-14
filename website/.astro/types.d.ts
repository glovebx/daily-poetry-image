declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		
	};

	type DataEntryMap = {
		"images": {
"1713481268019": {
	id: "1713481268019";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1713524819497": {
	id: "1713524819497";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1713527154189": {
	id: "1713527154189";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1713548111017": {
	id: "1713548111017";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1713549635504": {
	id: "1713549635504";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1713567958784": {
	id: "1713567958784";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1713654358631": {
	id: "1713654358631";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1713740735344": {
	id: "1713740735344";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1713827147220": {
	id: "1713827147220";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1713913567723": {
	id: "1713913567723";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1713999947892": {
	id: "1713999947892";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1714086372350": {
	id: "1714086372350";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1714259192641": {
	id: "1714259192641";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1714345533789": {
	id: "1714345533789";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1714431958707": {
	id: "1714431958707";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1714518355792": {
	id: "1714518355792";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1714604793959": {
	id: "1714604793959";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1714691185399": {
	id: "1714691185399";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1715016334383": {
	id: "1715016334383";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1715018255487": {
	id: "1715018255487";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1715036754508": {
	id: "1715036754508";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1715123148348": {
	id: "1715123148348";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1715209557120": {
	id: "1715209557120";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1715295964300": {
	id: "1715295964300";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1715382348722": {
	id: "1715382348722";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1715468755078": {
	id: "1715468755078";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1715555127868": {
	id: "1715555127868";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1715641566356": {
	id: "1715641566356";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1715727936141": {
	id: "1715727936141";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1715814405719": {
	id: "1715814405719";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1715900774520": {
	id: "1715900774520";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1715987173410": {
	id: "1715987173410";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1716073530168": {
	id: "1716073530168";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1716159974914": {
	id: "1716159974914";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1716439376829": {
	id: "1716439376829";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1716505553648": {
	id: "1716505553648";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1716591945417": {
	id: "1716591945417";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1716678352382": {
	id: "1716678352382";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1716764732311": {
	id: "1716764732311";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1716851142125": {
	id: "1716851142125";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1716937604334": {
	id: "1716937604334";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1717023948544": {
	id: "1717023948544";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1717110363992": {
	id: "1717110363992";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1717196749082": {
	id: "1717196749082";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1717283158920": {
	id: "1717283158920";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1717369543282": {
	id: "1717369543282";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1717455964634": {
	id: "1717455964634";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1717542391007": {
	id: "1717542391007";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1717628770126": {
	id: "1717628770126";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1717779927347": {
	id: "1717779927347";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1717801547411": {
	id: "1717801547411";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1717887959252": {
	id: "1717887959252";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1717974363539": {
	id: "1717974363539";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1718060746870": {
	id: "1718060746870";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1718147139769": {
	id: "1718147139769";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1718233535923": {
	id: "1718233535923";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1718319980779": {
	id: "1718319980779";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1718406364175": {
	id: "1718406364175";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1718634589697": {
	id: "1718634589697";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1718665575759": {
	id: "1718665575759";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1718751950143": {
	id: "1718751950143";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1718838345888": {
	id: "1718838345888";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1718924808178": {
	id: "1718924808178";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1719011146790": {
	id: "1719011146790";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1719097534077": {
	id: "1719097534077";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1719183982485": {
	id: "1719183982485";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1719270408703": {
	id: "1719270408703";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1719356737994": {
	id: "1719356737994";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1719443140611": {
	id: "1719443140611";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1719529603990": {
	id: "1719529603990";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1719615969237": {
	id: "1719615969237";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1719702337180": {
	id: "1719702337180";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1719788768540": {
	id: "1719788768540";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1720329564902": {
	id: "1720329564902";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1720393540139": {
	id: "1720393540139";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1720479954798": {
	id: "1720479954798";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1720566399283": {
	id: "1720566399283";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1720652754852": {
	id: "1720652754852";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1720739219610": {
	id: "1720739219610";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1720825549003": {
	id: "1720825549003";
  collection: "images";
  data: InferEntrySchema<"images">
};
"1720911938817": {
	id: "1720911938817";
  collection: "images";
  data: InferEntrySchema<"images">
};
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
