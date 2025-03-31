{
	'variables': {
		'bin': '<!(node -p "require(\'addon-tools-raub\').bin")',
		'cl_include': 'include',
	},
	'targets': [
		{
			'target_name': 'opencl',
			'includes': ['../node_modules/addon-tools-raub/utils/common.gypi'],
			'sources': [
				'cpp/bindings.cpp',
			],
			'include_dirs': [
				'<!@(node -p "require(\'addon-tools-raub\').getInclude()")',
				'<(cl_include)',
			],
			'library_dirs': ['<(module_root_dir)/lib'],
			'conditions': [
				['OS=="linux"', {
					'libraries': [
						"-Wl,-rpath,'$$ORIGIN'",
						'libOpenCL.so',
					],
				}],
				['OS=="mac"', {
					'libraries': ['-framework OpenCL'],
				}],
				['OS=="win"', {
					'libraries': ['OpenCL.lib'],
				}],
			],
		},
	],
}
