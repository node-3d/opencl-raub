{
	'variables': {
		'bin': '<!(node -e "import(\'@node-3d/addon-tools\').then((m) => m.printBin())")',
		'cl_include': 'include',
	},
	'targets': [
		{
			'target_name': 'opencl',
			'includes': ['common.gypi'],
			'sources': [
				'cpp/bindings.cpp',
			],
			'include_dirs': [
				'<!@(node -e "import(\'@node-3d/addon-tools\').then((m) => m.printInclude())")',
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
