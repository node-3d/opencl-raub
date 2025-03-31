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
			'conditions': [
				['OS=="linux"', {
					'libraries': [
						"-Wl,-rpath,'$$ORIGIN'",
						'-lOpenCL',
					],
				}],
				['OS=="mac"', {
					'libraries': ['-framework OpenCL'],
				}],
				['OS=="win"', {
					'library_dirs': ['<(module_root_dir)/lib'],
					'libraries': ['OpenCL.lib'],
				}],
			],
		},
	],
}
