import path from 'node:path';

export default function adapterStatic(options = {}) {
	return {
		name: '@sveltejs/adapter-static',
		async adapt(builder) {
			if (!options.fallback && builder.config.router?.type !== 'hash') {
				const dynamicRoutes = builder.routes.filter((route) => route.prerender !== true);

				if (dynamicRoutes.length > 0 && options.strict !== false) {
					const prefix = path.relative('.', builder.config.files.routes);
					const hasParamRoutes = builder.routes.some((route) => route.id.includes('['));
					const entriesChanged =
						JSON.stringify(builder.config.prerender.entries) !== '["*"]';
					const configOption =
						hasParamRoutes || entriesChanged
							? '  - adjust the `prerender.entries` config option and route entry points'
							: '';

					builder.log.error(
						`@sveltejs/adapter-static: all routes must be fully prerenderable, but found dynamic routes:
${dynamicRoutes.map((route) => `  - ${path.posix.join(prefix, route.id)}`).join('\n')}
${configOption}`
					);
					throw new Error('Encountered dynamic routes');
				}
			}

			const pages = options.pages ?? 'build';
			const assets = options.assets ?? pages;

			builder.rimraf(assets);
			builder.rimraf(pages);

			builder.generateEnvModule();
			builder.writeClient(assets);
			builder.writePrerendered(pages);

			if (options.fallback) {
				await builder.generateFallback(path.join(pages, options.fallback));
			}

			if (options.precompress) {
				builder.log.minor('Compressing assets and pages');
				if (pages === assets) {
					await builder.compress(assets);
				} else {
					await Promise.all([builder.compress(assets), builder.compress(pages)]);
				}
			}

			if (pages === assets) {
				builder.log(`Wrote site to "${pages}"`);
			} else {
				builder.log(`Wrote pages to "${pages}" and assets to "${assets}"`);
			}
		}
	};
}
