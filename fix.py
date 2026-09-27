import sys

path = 'c:/Users/565ga/Desktop/New folder (6)/_x/_x/Andromeda DEV/src/pages/Home/index.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

bad_section = '''              <PrincipleVisual
                type={currentPillar.visual}
                    progress *
                    pillars.length;'''

good_section = '''              <PrincipleVisual
                type={currentPillar.visual}
                accent={currentPillar.accent}
                videoSrc={currentPillar.videoSrc}
                progress={localProgress}
                isMuted={globalMuted}
                onToggleMute={() => setGlobalMuted(!globalMuted)}
              />

            </div>
          </div>

          <div className="alc-principles__copy-stage">

            <div className="alc-principles__copy">

              {pillars.map(
                (
                  pillar,
                  index
                ) => {
                  const position =
                    index -
                    progress *
                    pillars.length;'''

if bad_section in content:
    content = content.replace(bad_section, good_section)
    print('Found first bad section')
else:
    print('First bad section not found')

bad_copy_number = '''                    >
                      <div className="alc-principles__copy-number">
                        {pillar.id}
                        {"  //  "}
                        {pillar.system}
                      </div>

                      <h3 className="alc-principles__copy-title">'''

good_copy_number = '''                    >
                      <h3 className="alc-principles__copy-title">'''

if bad_copy_number in content:
    content = content.replace(bad_copy_number, good_copy_number)
    print('Found second bad section')
else:
    print('Second bad section not found')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
