const K='c360v2';
const state=JSON.parse(localStorage.getItem(K)||'{"empresas":[],"funcionarios":[]}');
const save=()=>localStorage.setItem(K,JSON.stringify(state));
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const onlyDigits=s=>String(s||'').replace(/\D/g,'');
const money=s=>s?Number(s).toLocaleString('pt-BR',{minimumFractionDigits:2}):'';
function render(view='dashboard'){
 document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
 $('#title').textContent={dashboard:'Dashboard',empresas:'Empresas',funcionarios:'Funcionários',pendencias:'Painel de Pendências'}[view];
 if(view==='dashboard')dashboard(); if(view==='empresas')empresas(); if(view==='funcionarios')funcionarios(); if(view==='pendencias')pendencias();
}
function dashboard(){
 $('#content').innerHTML=`<div class="grid">
 <div class="card"><div class="muted">Empresas cadastradas</div><div class="num">${state.empresas.length}</div></div>
 <div class="card"><div class="muted">Funcionários</div><div class="num">${state.funcionarios.length}</div></div>
 <div class="card"><div class="muted">Certificados a conferir</div><div class="num">${state.empresas.filter(e=>!e.certVal).length}</div></div>
 <div class="card"><div class="muted">Pendências de cadastro</div><div class="num">${state.empresas.filter(e=>!e.ie||!e.im).length}</div></div></div>
 <div class="card" style="margin-top:18px"><h3>Contábil 360 — V2</h3><p class="muted">Cadastro de empresas com consulta de CNPJ, preenchimento automático dos dados básicos, cadastro de funcionários e painel de pendências.</p>
 <p class="muted"><b>Consulta CNPJ:</b> usa uma API pública de dados cadastrais. Confira os dados antes de salvar.</p></div>`;
}
function empresas(){
 $('#content').innerHTML=`<div class="toolbar"><div class="muted">Cadastro completo de clientes</div><button class="primary" onclick="empresaForm()">+ Nova empresa</button></div>
 ${state.empresas.length?`<table class="table"><thead><tr><th>Razão social</th><th>CNPJ</th><th>Regime</th><th>Situação</th><th>IE</th><th>IM</th><th></th></tr></thead><tbody>${state.empresas.map((e,i)=>`<tr>
 <td>${esc(e.razao)}</td><td>${esc(e.cnpj)}</td><td>${esc(e.regime)}</td><td>${esc(e.situacao||'—')}</td><td>${esc(e.ie||'—')}</td><td>${esc(e.im||'—')}</td>
 <td class="actions"><button onclick="empresaForm(${i})">Editar</button><button onclick="delEmpresa(${i})">Excluir</button></td></tr>`).join('')}</tbody></table>`:'<div class="card empty">Nenhuma empresa cadastrada.</div>'}`;
}
function empresaForm(i){
 const e=state.empresas[i]||{};
 $('#modalContent').innerHTML=`<h2>${i==null?'Nova empresa':'Editar empresa'}</h2>
 <div class="notice">💡 Digite o CNPJ e clique em <b>Consultar CNPJ</b> para tentar preencher automaticamente os dados básicos da empresa.</div>
 <div class="tabs"><button class="tab active" data-tab="geral">Dados gerais</button><button class="tab" data-tab="fiscal">Fiscal</button><button class="tab" data-tab="endereco">Endereço</button><button class="tab" data-tab="dp">DP</button><button class="tab" data-tab="cert">Certificado</button><button class="tab" data-tab="socios">Sócios</button><button class="tab" data-tab="bancario">Bancário</button><button class="tab" data-tab="docs">Documentos</button></div>
 <form id="ef">
 <div class="tabpanel active" data-panel="geral"><div class="formgrid">
 <div class="field"><label>CNPJ</label><div class="inline"><input id="cnpjInput" name="cnpj" maxlength="18" placeholder="00.000.000/0000-00" value="${esc(e.cnpj)}"><button type="button" class="secondary" id="lookupCnpj">Consultar CNPJ</button></div><small id="lookupStatus" class="muted"></small></div>
 <div class="field"><label>Razão social *</label><input id="razao" name="razao" required value="${esc(e.razao)}"></div>
 <div class="field"><label>Nome fantasia</label><input id="fantasia" name="fantasia" value="${esc(e.fantasia)}"></div>
 <div class="field"><label>Data de abertura</label><input type="date" id="abertura" name="abertura" value="${esc(e.abertura)}"></div>
 <div class="field"><label>Situação cadastral</label><input id="situacao" name="situacao" value="${esc(e.situacao)}"></div>
 <div class="field"><label>Porte</label><input id="porte" name="porte" value="${esc(e.porte)}"></div>
 <div class="field"><label>Natureza jurídica</label><input id="natureza" name="natureza" value="${esc(e.natureza)}"></div>
 <div class="field"><label>Regime tributário *</label><select name="regime"><option>MEI</option><option>Simples Nacional</option><option>Simples Híbrido</option><option>Lucro Presumido</option><option>Lucro Real</option><option>Lucro Arbitrado</option></select></div>
 </div></div>
 <div class="tabpanel" data-panel="fiscal"><div class="formgrid">
 <div class="field"><label>Inscrição Estadual</label><input name="ie" value="${esc(e.ie)}"></div><div class="field"><label>Inscrição Municipal</label><input name="im" value="${esc(e.im)}"></div>
 <div class="field"><label>CNAE principal</label><input id="cnae" name="cnae" value="${esc(e.cnae)}"></div><div class="field full"><label>Descrição CNAE</label><input id="cnaeDesc" name="cnaeDesc" value="${esc(e.cnaeDesc)}"></div>
 </div></div>
 <div class="tabpanel" data-panel="endereco"><div class="formgrid">
 <div class="field"><label>CEP</label><input id="cep" name="cep" value="${esc(e.cep)}"></div><div class="field"><label>Logradouro</label><input id="endereco" name="endereco" value="${esc(e.endereco)}"></div>
 <div class="field"><label>Número</label><input id="numero" name="numero" value="${esc(e.numero)}"></div><div class="field"><label>Complemento</label><input id="complemento" name="complemento" value="${esc(e.complemento)}"></div>
 <div class="field"><label>Bairro</label><input id="bairro" name="bairro" value="${esc(e.bairro)}"></div><div class="field"><label>Município</label><input id="cidade" name="cidade" value="${esc(e.cidade)}"></div><div class="field"><label>UF</label><input id="uf" name="uf" value="${esc(e.uf)}"></div>
 </div></div>
 <div class="tabpanel" data-panel="dp"><div class="formgrid"><div class="field"><label>Responsável pelo DP</label><input name="responsavelDP" value="${esc(e.responsavelDP)}"></div><div class="field"><label>Observações do DP</label><input name="obsDP" value="${esc(e.obsDP)}"></div></div></div>
 <div class="tabpanel" data-panel="cert"><div class="formgrid"><div class="field"><label>Certificado digital — vencimento</label><input type="date" name="certVal" value="${esc(e.certVal)}"></div><div class="field"><label>Tipo</label><select name="certTipo"><option value="">Selecione</option><option>A1</option><option>A3</option></select></div></div></div>
 <div class="tabpanel" data-panel="socios"><div class="field full"><label>Sócios / responsáveis</label><textarea name="socios" placeholder="Nome, CPF/CNPJ e participação">${esc(e.socios)}</textarea></div></div>
 <div class="tabpanel" data-panel="bancario"><div class="formgrid"><div class="field"><label>Banco</label><input name="banco" value="${esc(e.banco)}"></div><div class="field"><label>Agência</label><input name="agencia" value="${esc(e.agencia)}"></div><div class="field"><label>Conta</label><input name="conta" value="${esc(e.conta)}"></div><div class="field"><label>PIX</label><input name="pix" value="${esc(e.pix)}"></div></div></div>
 <div class="tabpanel" data-panel="docs"><div class="formgrid"><div class="field full"><label>Documentos / observações</label><textarea name="obs">${esc(e.obs)}</textarea></div></div></div>
 <div class="footer"><button type="button" class="secondary" onclick="closeModal()">Cancelar</button><button class="primary">Salvar empresa</button></div></form>`;
 $('#ef [name=regime]').value=e.regime||'MEI';
 $('#modal').classList.remove('hidden');
 document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tabpanel').forEach(x=>x.classList.remove('active'));t.classList.add('active');document.querySelector(`[data-panel="${t.dataset.tab}"]`).classList.add('active')});
 $('#cnpjInput').addEventListener('input',ev=>{let d=onlyDigits(ev.target.value).slice(0,14);ev.target.value=d.length>2?d.replace(/^(\d{2})(\d)/,'$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/,'$1.$2.$3').replace(/\.(\d{3})(\d)/,'$1/$2').replace(/(\d{4})(\d)/,'$1-$2'):d});
 $('#lookupCnpj').onclick=()=>lookupCnpj();
 $('#ef').onsubmit=ev=>{ev.preventDefault();const d=Object.fromEntries(new FormData(ev.target));if(i==null)state.empresas.push(d);else state.empresas[i]=d;save();closeModal();empresas()};
}
async function lookupCnpj(){
 const input=$('#cnpjInput'), status=$('#lookupStatus'), btn=$('#lookupCnpj'); if(!input)return;
 const cnpj=onlyDigits(input.value); if(cnpj.length!==14){status.textContent='Informe um CNPJ válido com 14 dígitos.';status.className='danger';return}
 btn.disabled=true; status.textContent='Consultando...'; status.className='muted';
 try{
   const r=await fetch('https://brasilapi.com.br/api/cnpj/v1/'+cnpj);
   if(!r.ok) throw new Error('CNPJ não localizado ou serviço indisponível.');
   const d=await r.json();
   const set=(id,v)=>{const el=$('#'+id);if(el&&v!==undefined&&v!==null)el.value=v};
   set('razao',d.razao_social); set('fantasia',d.nome_fantasia); set('situacao',d.descricao_situacao_cadastral||d.situacao_cadastral);
   set('porte',d.porte); set('natureza',d.natureza_juridica); set('cnae',d.cnae_fiscal); set('cnaeDesc',d.cnae_fiscal_descricao);
   set('cep',d.cep); set('endereco',d.logradouro); set('numero',d.numero); set('complemento',d.complemento);
   set('bairro',d.bairro); set('cidade',d.municipio); set('uf',d.uf);
   if(d.data_inicio_atividade) set('abertura',d.data_inicio_atividade.slice(0,10));
   status.textContent='✓ Dados básicos preenchidos. Confira antes de salvar.';status.className='ok';
 }catch(err){status.textContent='Não foi possível consultar: '+err.message;status.className='danger'}
 finally{btn.disabled=false}
}
function delEmpresa(i){if(confirm('Excluir esta empresa?')){state.empresas.splice(i,1);save();empresas()}}
function funcionarios(){
 $('#content').innerHTML=`<div class="toolbar"><div class="muted">Cadastro integrado ao módulo de Departamento Pessoal</div><button class="primary" onclick="funcForm()">+ Novo funcionário</button></div>
 ${state.funcionarios.length?`<table class="table"><thead><tr><th>Nome</th><th>CPF</th><th>Empresa</th><th>Cargo</th><th>Admissão</th><th></th></tr></thead><tbody>${state.funcionarios.map((f,i)=>`<tr><td>${esc(f.nome)}</td><td>${esc(f.cpf)}</td><td>${esc(f.empresa)}</td><td>${esc(f.cargo)}</td><td>${esc(f.admissao)}</td><td class="actions"><button onclick="funcForm(${i})">Editar</button><button onclick="delFunc(${i})">Excluir</button></td></tr>`).join('')}</tbody></table>`:'<div class="card empty">Nenhum funcionário cadastrado.</div>'}`;
}
function funcForm(i){
 const f=state.funcionarios[i]||{};
 $('#modalContent').innerHTML=`<h2>${i==null?'Novo funcionário':'Editar funcionário'}</h2><form id="ff"><div class="formgrid">
 <div class="field"><label>Nome completo *</label><input name="nome" required value="${esc(f.nome)}"></div><div class="field"><label>CPF</label><input name="cpf" value="${esc(f.cpf)}"></div>
 <div class="field"><label>Empresa</label><select name="empresa"><option value="">Selecione</option>${state.empresas.map(e=>`<option>${esc(e.razao)}</option>`).join('')}</select></div>
 <div class="field"><label>Matrícula</label><input name="matricula" value="${esc(f.matricula)}"></div><div class="field"><label>Data de nascimento</label><input type="date" name="nascimento" value="${esc(f.nascimento)}"></div><div class="field"><label>Data de admissão</label><input type="date" name="admissao" value="${esc(f.admissao)}"></div>
 <div class="field"><label>Cargo</label><input name="cargo" value="${esc(f.cargo)}"></div><div class="field"><label>Salário base</label><input type="number" step="0.01" name="salario" value="${esc(f.salario)}"></div>
 <div class="field"><label>Tipo de contrato</label><select name="contrato"><option>CLT</option><option>Aprendiz</option><option>Estágio</option><option>Temporário</option></select></div>
 <div class="field"><label>eSocial — categoria</label><input name="categoria" value="${esc(f.categoria)}"></div><div class="field full"><label>Observações</label><textarea name="obs">${esc(f.obs)}</textarea></div>
 </div><div class="footer"><button type="button" class="secondary" onclick="closeModal()">Cancelar</button><button class="primary">Salvar funcionário</button></div></form>`;
 if(f.empresa)$('#ff [name=empresa]').value=f.empresa;if(f.contrato)$('#ff [name=contrato]').value=f.contrato;
 $('#modal').classList.remove('hidden');$('#ff').onsubmit=ev=>{ev.preventDefault();const d=Object.fromEntries(new FormData(ev.target));if(i==null)state.funcionarios.push(d);else state.funcionarios[i]=d;save();closeModal();funcionarios()}
}
function delFunc(i){if(confirm('Excluir este funcionário?')){state.funcionarios.splice(i,1);save();funcionarios()}}
function pendencias(){
 const rows=state.empresas.flatMap(e=>[!e.ie&&[e.razao,'Inscrição Estadual','Cadastrar ou marcar como isento'],!e.im&&[e.razao,'Inscrição Municipal','Cadastrar ou informar a situação'],!e.certVal&&[e.razao,'Certificado digital','Informar vencimento']].filter(Boolean));
 $('#content').innerHTML=`<div class="card"><h3>Painel de Pendências</h3><p class="muted">Conferências básicas do cadastro da empresa.</p>${rows.length?`<table class="table"><thead><tr><th>Empresa</th><th>Pendência</th><th>Ação</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r[0])}</td><td>${r[1]}</td><td class="danger">${r[2]}</td></tr>`).join('')}</tbody></table>`:'<p class="ok">✓ Nenhuma pendência básica encontrada.</p>'}</div>`
}
function closeModal(){$('#modal').classList.add('hidden')}
$('#close').onclick=closeModal;$('#modal').onclick=e=>{if(e.target.id==='modal')closeModal()};
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>render(b.dataset.view));
$('#backup').onclick=()=>{const a=document.createElement('a');a.href='data:application/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(state,null,2));a.download='contabil360-v2-dados.json';a.click()};
render();
