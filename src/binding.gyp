{
	'variables': {
		'bin'        : '<!(node -p "require(\'addon-tools-raub\').bin")',
		'cl_include' : 'include',
		'cl_bin'     : '<(module_root_dir)/lib',
	},
	'targets': [
		{
			'target_name': 'opencl',
			'sources': [
				'cpp/bindings.cpp',
				'cpp/queue.cpp',
				'cpp/common.cpp',
				'cpp/context.cpp',
				'cpp/device.cpp',
				'cpp/event.cpp',
				'cpp/kernel.cpp',
				'cpp/memobj.cpp',
				'cpp/platform.cpp',
				'cpp/program.cpp',
				'cpp/sampler.cpp',
				'cpp/types.cpp',
			],
			'include_dirs': [
				'<(cl_include)',
				'<!@(node -p "require(\'addon-tools-raub\').include")',
			],
			'cflags!': ['-fno-exceptions'],
			'cflags_cc!': ['-fno-exceptions'],
			'library_dirs': ['<(cl_bin)'],
			'conditions': [
				[
					'OS=="linux"',
					{
						'libraries': [
							# "-Wl,-rpath,'$$ORIGIN'",
							# 'libOpenCL.so',
							'<(cl_bin)/libOpenCL.so',
						],
						'cflags_cc': ['-std=c++11', '-Wall', '-O3', '-Wno-ignored-attributes'],
						'defines': ['__linux__'],
					}
				],
				[
					'OS=="mac"',
					{
						# "/System/Library/Frameworks/OpenCL.framework/OpenCL"
						# 'libraries': [
						# 	'-Wl,-rpath,@loader_path',
						# 	'<(cl_bin)/libOpenCL.so',
						# ],
						"xcode_settings": {
							'OTHER_CPLUSPLUSFLAGS' : ['-mavx','-O3','-std=c++11','-stdlib=libc++','-Wall'],
							'OTHER_LDFLAGS': ['-stdlib=libc++'],
							'MACOSX_DEPLOYMENT_TARGET': '10.10'
						},
						'libraries': ['-framework OpenCL'],
						'defines': ['__APPLE__'],
					}
				],
				[
					'OS=="win"',
					{
						'libraries': ['OpenCL.lib'],
						'defines' : [
							'WIN32_LEAN_AND_MEAN',
							'VC_EXTRALEAN',
							'_WIN32',
						],
						'msvs_settings' : {
							'VCCLCompilerTool' : {
								'AdditionalOptions' : [
									'/O2','/Oy','/GL','/GF','/Gm-',
									'/EHsc','/MT','/GS','/Gy','/GR-','/Gd',
								]
							},
							'VCLinkerTool' : {
								'AdditionalOptions' : ['/OPT:REF','/OPT:ICF','/LTCG']
							},
						},
					},
				],
			],
		},
	],
}
