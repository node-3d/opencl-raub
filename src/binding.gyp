{
	'variables': {
		'bin': '<!(node -p "require(\'addon-tools-raub\').bin")',
		'cl_include': 'include',
		'cl_bin': '<(module_root_dir)/lib',
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
			'library_dirs': ['<(cl_bin)'],
			'conditions': [
				['OS=="linux"', {
					'libraries': [
						"-Wl,-rpath,'$$ORIGIN'",
						# 'libOpenCL.so',
						'<(cl_bin)/libOpenCL.so',
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
