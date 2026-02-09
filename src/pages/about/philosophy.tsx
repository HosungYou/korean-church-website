// ===========================================
// VS Design Diverge: Philosophy Page
// OKLCH Color System + Editorial Minimalism
// ===========================================

import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/Layout'
import PageHeader from '@/components/PageHeader'
import Image from 'next/image'

const Philosophy: NextPage = () => {
  return (
    <Layout>
      <PageHeader
        title="목회 철학"
        subtitle="골로새서 1:28을 기초로 예수 그리스도의 사역을 본받는 교회"
        label="Ministry Philosophy"
        height="h-72 md:h-80"
      />

      {/* ── Section 1: 예수님의 3중 사역 ── */}
      <section className="py-20" style={{ background: 'oklch(0.985 0.003 75)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Editorial Section Header */}
            <div className="mb-12">
              <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
                style={{ color: 'oklch(0.72 0.10 75)' }}
              >
                Colossians 1:28
              </span>
              <h2
                className="font-headline font-bold"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}
              >
                예수님의 3중 사역
              </h2>
            </div>

            {/* Key Verse Card */}
            <div
              className="rounded-sm p-8 md:p-10 mb-10"
              style={{
                background: 'linear-gradient(135deg, oklch(0.30 0.09 265 / 0.05), oklch(0.72 0.10 75 / 0.08))',
                border: '1px solid oklch(0.72 0.10 75 / 0.3)',
              }}
            >
              <p
                className="text-lg md:text-xl font-semibold leading-relaxed font-korean"
                style={{ color: 'oklch(0.30 0.09 265)' }}
              >
                &ldquo;우리가 그를 전파하여 각 사람을 권하고 모든 지혜로 각 사람을 가르침은
                각 사람을 그리스도 안에서 완전한 자로 세우려 함이니&rdquo;
              </p>
              <p
                className="text-base mt-3 font-korean"
                style={{ color: 'oklch(0.55 0.01 75)' }}
              >
                &mdash; 골로새서 1:28
              </p>
            </div>

            <p className="leading-relaxed font-korean mb-8" style={{ color: 'oklch(0.45 0.03 75)' }}>
              골로새서 1:28절이 우리 교회의 사역이며 성도들이 행해야 하고,
              특별히 교회의 제직들이 가져야 하는 사역의 모습과 목적입니다.
            </p>

            {/* Threefold Ministry Image */}
            <div className="rounded-sm overflow-hidden mb-10" style={{ boxShadow: '0 4px 16px oklch(0.30 0.09 265 / 0.10)' }}>
              <Image
                src="/images/philosophy/threefold-ministry.jpeg"
                alt="예수님의 3중 사역 - 전파, 가르침, 세움"
                width={1200}
                height={500}
                className="w-full h-auto"
              />
            </div>

            {/* Three Ministry Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                {
                  title: '전파 (Proclaiming)',
                  subtitle: '우리가 그를 전파하여',
                  desc: '예수님이 그리스도 되심과 그의 십자가의 복음 전파가 교회의 존재 목적입니다.',
                  color: 'oklch(0.45 0.12 265)',
                },
                {
                  title: '가르침 (Teaching)',
                  subtitle: '모든 지혜로 각 사람을 가르침은',
                  desc: '모든 지혜로 각 사람을 가르침은 교회가 행해야 하는 복음 사역이며 진리를 이 땅에 전하는 하나님의 명령입니다.',
                  color: 'oklch(0.55 0.08 265)',
                },
                {
                  title: '세움 (Equipping)',
                  subtitle: '각 사람을 완전한 자로 세우려 함이니',
                  desc: '각 사람을 권면하고 그들의 삶의 어려움에서 건져 내는 것이 교회가 지닌 사명입니다.',
                  color: 'oklch(0.65 0.06 265)',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-sm p-6 transition-all duration-300 hover:translate-y-[-2px]"
                  style={{
                    background: 'oklch(0.97 0.005 75)',
                    border: '1px solid oklch(0.92 0.005 75)',
                    boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)',
                    borderTop: `3px solid ${item.color}`,
                  }}
                >
                  <h3 className="text-lg font-bold mb-2 font-korean" style={{ color: 'oklch(0.25 0.05 265)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium mb-3 font-korean" style={{ color: item.color }}>
                    {item.subtitle}
                  </p>
                  <p className="text-sm font-korean leading-relaxed" style={{ color: 'oklch(0.55 0.01 75)' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Supporting Scripture */}
            <div
              className="rounded-sm p-6"
              style={{
                background: 'oklch(0.97 0.005 75)',
                borderLeft: '4px solid oklch(0.72 0.10 75)',
              }}
            >
              <p className="text-sm font-korean leading-relaxed" style={{ color: 'oklch(0.45 0.03 75)' }}>
                &ldquo;...회당에서 가르치시며, 천국 복음을 전파하시며, 백성 중의 모든 병과 모든 약한 것을 고치시니&rdquo;
              </p>
              <p className="text-xs mt-2 font-korean" style={{ color: 'oklch(0.72 0.10 75)' }}>
                &mdash; 마태복음 4:23
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: 구체적인 목회 형태 ── */}
      <section className="py-20" style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
                style={{ color: 'oklch(0.72 0.10 75)' }}
              >
                Specific Ministry Form
              </span>
              <h2
                className="font-headline font-bold"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}
              >
                구체적인 목회 형태
              </h2>
            </div>

            <p className="leading-relaxed font-korean mb-8" style={{ color: 'oklch(0.45 0.03 75)' }}>
              저의 목회 형태는 사도행전의 원시 기독교 공동체의 삶 형태 속에 있었던 예배, 교제, 교육, 복음 선포, 섬김을
              적용하는 것입니다 (사도행전 2:42-47). 이것은 사역의 기능이 아니라 원래부터 있었던 하나님을 섬기는
              사람들의 존재 양식이요 하나님을 아버지로 모시고 모였던 백성들의 신앙 경험의 표현양식이었습니다.
            </p>

            {/* Ministry Form Image */}
            <div
              className="rounded-sm overflow-hidden mb-10 flex justify-center"
              style={{
                background: 'oklch(0.985 0.003 75)',
                boxShadow: '0 4px 16px oklch(0.30 0.09 265 / 0.10)',
              }}
            >
              <Image
                src="/images/philosophy/ministry-form.png"
                alt="구체적인 목회 형태 - 사도행전 2:42-47을 모델로 하는 교회"
                width={700}
                height={700}
                className="w-full max-w-[600px] h-auto p-4"
              />
            </div>

            {/* Five Confessions */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-6 font-korean" style={{ color: 'oklch(0.25 0.05 265)' }}>
                고백적 선언과 실천항목
              </h3>
              <div className="space-y-4">
                {[
                  {
                    confession: '우리가 하나님을 예배한다 (Leiturgia)',
                    practice: '예배와 예전 그리고 기도',
                    verse: '롬 12:1-2',
                  },
                  {
                    confession: '우리는 성령 안에서 더불어 살아간다 (Koinonia)',
                    practice: '친교와 교제',
                    verse: '엡 4:13-16',
                  },
                  {
                    confession: '우리는 하나님의 백성으로 성숙한다 (Didache)',
                    practice: '가르침과 훈련',
                    verse: '골 3:16-17',
                  },
                  {
                    confession: '우리는 하나님나라를 선포한다 (Kerygma)',
                    practice: '말씀의 선포와 전도',
                    verse: '사 60:22',
                  },
                  {
                    confession: '우리는 예수님의 섬김으로 이웃을 사랑한다 (Diakonia)',
                    practice: '봉사와 섬김',
                    verse: '약 1:26-27',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="rounded-sm p-5 flex flex-col md:flex-row md:items-center gap-3"
                    style={{
                      background: 'oklch(0.985 0.003 75)',
                      border: '1px solid oklch(0.92 0.005 75)',
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center font-bold text-sm"
                      style={{
                        background: 'oklch(0.45 0.12 265)',
                        color: 'oklch(0.98 0.003 75)',
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold font-korean" style={{ color: 'oklch(0.25 0.05 265)' }}>
                        {item.confession}
                      </p>
                      <p className="text-sm font-korean" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        {item.practice}
                      </p>
                    </div>
                    <span
                      className="text-xs font-medium px-3 py-1 rounded-sm flex-shrink-0"
                      style={{ background: 'oklch(0.72 0.10 75 / 0.15)', color: 'oklch(0.55 0.08 75)' }}
                    >
                      {item.verse}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Church Ministry Map ── */}
      <section className="py-20" style={{ background: 'oklch(0.985 0.003 75)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
                style={{ color: 'oklch(0.72 0.10 75)' }}
              >
                Church Ministry Map
              </span>
              <h2
                className="font-headline font-bold"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}
              >
                교회 미니스트리 맵
              </h2>
            </div>

            <p className="leading-relaxed font-korean mb-8" style={{ color: 'oklch(0.45 0.03 75)' }}>
              하나님의 말씀에 기반하여 성령님의 도우심과 성도들과 협력하여 교회를 목회적으로
              운영할 때 제가 그리고 있는 실제적인 교회 미니스트리 맵은 아래와 같습니다.
            </p>

            {/* Ministry Map Image */}
            <div
              className="rounded-sm overflow-hidden mb-10 flex justify-center"
              style={{
                background: 'oklch(0.985 0.003 75)',
                boxShadow: '0 4px 16px oklch(0.30 0.09 265 / 0.10)',
              }}
            >
              <Image
                src="/images/philosophy/ministry-map.png"
                alt="Church Ministry Map - 양육, 훈련, 사역의 체계"
                width={700}
                height={800}
                className="w-full max-w-[600px] h-auto p-4"
              />
            </div>

            {/* Three Levels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  level: 'Individual',
                  title: '양육 (개인)',
                  items: ['경건의 시간 (QT)', '개인 기도', '새가족반', '평신도 사역자로서의 의식'],
                  desc: '개인의 신앙 기초를 세우는 단계입니다. 경건의 시간과 기도를 통해 하나님과의 관계를 형성합니다.',
                },
                {
                  level: 'Relationship',
                  title: '훈련 (관계)',
                  items: ['예배/설교', '사랑방', '중보기도모임', '초급반 · 제자훈련 · 사역훈련 · 리더훈련'],
                  desc: '공동체 안에서 관계를 통해 성장하는 단계입니다. 예배와 소그룹을 통해 그리스도인으로 훈련됩니다.',
                },
                {
                  level: 'Activity',
                  title: '사역 (활동)',
                  items: ['각종 은사별 사역팀', '교회내 사역 · 대외 사역', '전도/선교', '하나님 나라'],
                  desc: '훈련받은 성도가 은사에 따라 섬기는 단계입니다. 교회 내외의 사역을 통해 하나님 나라를 확장합니다.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-sm p-6"
                  style={{
                    background: 'oklch(0.97 0.005 75)',
                    border: '1px solid oklch(0.92 0.005 75)',
                    boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.06)',
                  }}
                >
                  <span
                    className="text-xs font-medium tracking-[0.15em] uppercase mb-2 block"
                    style={{ color: 'oklch(0.72 0.10 75)' }}
                  >
                    {item.level}
                  </span>
                  <h3 className="text-lg font-bold mb-3 font-korean" style={{ color: 'oklch(0.25 0.05 265)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm font-korean leading-relaxed mb-4" style={{ color: 'oklch(0.55 0.01 75)' }}>
                    {item.desc}
                  </p>
                  <ul className="space-y-1.5">
                    {item.items.map((li, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 mr-2 flex-shrink-0" style={{ background: 'oklch(0.72 0.10 75)' }} />
                        <span className="font-korean" style={{ color: 'oklch(0.45 0.03 265)' }}>{li}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: 교회의 존재 이유와 우리의 사역 ── */}
      <section className="py-20" style={{ background: 'oklch(0.97 0.005 75)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <div className="h-0.5 w-12 mb-6" style={{ background: 'linear-gradient(90deg, oklch(0.72 0.10 75), oklch(0.45 0.12 265))' }} />
              <span
                className="text-xs font-medium tracking-[0.2em] uppercase mb-4 block"
                style={{ color: 'oklch(0.72 0.10 75)' }}
              >
                Our Calling
              </span>
              <h2
                className="font-headline font-bold"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em', color: 'oklch(0.25 0.05 265)' }}
              >
                교회의 존재 이유와 우리의 사역
              </h2>
            </div>

            <p className="leading-relaxed font-korean mb-6" style={{ color: 'oklch(0.45 0.03 75)' }}>
              모든 성숙한 성도는 두 가지 의미의 사역자가 되어야 합니다.
              첫째, 복음의 일꾼이 되어야 합니다 (골 1:23). 복음의 확신이 필요하며, 하나님의 사역에 대하여 분명히 알고
              증거할 수 있어야 합니다.
              둘째, 교회의 일꾼이 되어야 합니다 (골 1:25). 지역 교회가 왜 존재해야 하는지에 대한 확실한 근거가 중요합니다.
            </p>

            {/* Key Question Card */}
            <div
              className="rounded-sm p-8 md:p-10 mb-10"
              style={{
                background: 'oklch(0.25 0.08 265)',
                boxShadow: '0 4px 16px oklch(0.30 0.09 265 / 0.15)',
              }}
            >
              <p
                className="text-xs font-medium tracking-[0.15em] uppercase mb-4"
                style={{ color: 'oklch(0.72 0.10 75)' }}
              >
                마태복음 28:19-20
              </p>
              <p
                className="text-lg md:text-xl font-bold leading-relaxed font-korean"
                style={{ color: 'oklch(0.98 0.003 75)' }}
              >
                그렇다면 우리 교회의 존재 이유와<br />
                우리 (제직, 성도로서의 직분자들)의 사역은 어떠해야 하는가?
              </p>
            </div>

            {/* Five Discipleship Principles */}
            <div className="space-y-5">
              {[
                {
                  num: '1',
                  title: '제자론의 기본은 하나님 앞에서 인간의 존재론을 정립하는 것이다',
                  desc: '하나님이 누구신가에 대한 바른 신관의 정립과 함께 자신의 정체성을 정립하는 것에서 시작됩니다.',
                },
                {
                  num: '2',
                  title: '존재론을 정립한 사람은 개인의 성품을 변화시켜 나간다',
                  desc: '하나님과의 관계 속에서 그리스도의 성품을 닮아가며 날로 변화되는 삶을 살아갑니다.',
                },
                {
                  num: '3',
                  title: '참된 인격을 만들어가는 자들은 공동체를 위해 참된 해석자가 되어간다',
                  desc: '성숙한 그리스도인은 공동체 안에서 하나님의 말씀을 올바르게 해석하고 적용하는 역할을 감당합니다.',
                },
                {
                  num: '4',
                  title: '해석하는 공동체인 교회는 예언적 공동체며 은혜의 공동체다',
                  desc: '교회는 세상 속에서 하나님의 뜻을 선포하고 은혜를 나누는 예언적 역할을 수행합니다.',
                },
                {
                  num: '5',
                  title: '기독교 공동체는 완성된 종말을 이곳에서 살아가는 시간론에 기초한다',
                  desc: '이미 이루어진 하나님 나라의 완성을 믿으며, 지금 이곳에서 그 나라의 가치를 실현해 갑니다.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-sm p-6 md:p-8"
                  style={{
                    background: 'oklch(0.985 0.003 75)',
                    border: '1px solid oklch(0.92 0.005 75)',
                    boxShadow: '0 2px 8px oklch(0.30 0.09 265 / 0.04)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-sm flex items-center justify-center font-bold text-sm"
                      style={{
                        background: 'oklch(0.45 0.12 265)',
                        color: 'oklch(0.98 0.003 75)',
                      }}
                    >
                      {item.num}
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold mb-2 font-korean" style={{ color: 'oklch(0.25 0.05 265)' }}>
                        {item.title}
                      </h3>
                      <p className="text-sm font-korean leading-relaxed" style={{ color: 'oklch(0.55 0.01 75)' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Closing Philosophy */}
            <div
              className="rounded-sm p-8 md:p-10 mt-10"
              style={{
                background: 'linear-gradient(135deg, oklch(0.30 0.09 265 / 0.05), oklch(0.72 0.10 75 / 0.08))',
                border: '1px solid oklch(0.72 0.10 75 / 0.3)',
              }}
            >
              <h3 className="text-lg font-bold mb-4 font-korean" style={{ color: 'oklch(0.30 0.09 265)' }}>
                목회 철학
              </h3>
              <p className="leading-relaxed font-korean mb-3" style={{ color: 'oklch(0.45 0.03 75)' }}>
                &ldquo;복음의 진리 가운데 모든 이들이 하나님의 생명 가운데 자유함을 누리게 하는 것이다.&rdquo;
              </p>
              <div className="space-y-2 mt-4">
                {[
                  '우리는 세상의 진리가 아닌 하나님의 진리를 선포하는 것이다',
                  '우리는 이 땅의 생명으로 하나님의 영원한 생명을 경험하는 것이다',
                  '우리는 하나님의 생명 가운데 참 자유함을 누리는 것이다',
                ].map((text, i) => (
                  <p key={i} className="text-sm font-korean leading-relaxed" style={{ color: 'oklch(0.45 0.12 265)' }}>
                    {text}
                  </p>
                ))}
              </div>
              <p className="text-xs mt-4 font-korean" style={{ color: 'oklch(0.55 0.01 75)' }}>
                (요한복음 8장과 10장 &ldquo;진리가 너희를 자유케 하리라&rdquo;, &ldquo;풍성함을 누리는 삶&rdquo;)
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  }
}

export default Philosophy
